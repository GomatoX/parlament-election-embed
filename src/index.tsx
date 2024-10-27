import { hydrate, prerender as ssr } from "preact-iso";

import "@fontsource/source-sans-pro/400.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";

import "./assets/scss/main.scss";

import { useEffect, useState } from "preact/hooks";
import { parseISO } from "date-fns";

import Tabs from "./components/Tabs";
import SingleMandate from "./components/SingleMandate";
import Parties from "./components/Parties";
import axios from "axios";
import {
  MultiMandateResponse,
  SingleMandateItemResponse,
  SingleMandateResponse,
} from "./types";

// More info about id of elections
// https://www.vrk.lt/statiniai/puslapiai/rinkimai/rt.json
// dir + id /1104/1/1746
const TOUR_ONE_ELECTION_ID = import.meta.env.VITE_ELECTION_TOUR_ONE_ID;
const TOUR_TWO_ELECTION_ID = import.meta.env.VITE_ELECTION_TOUR_TWO_ID;

// Set depending on elections tour
export const ACTIVE_ELECTION_ID = TOUR_TWO_ELECTION_ID;

const BASE_URL = (tour: string = ACTIVE_ELECTION_ID) =>
  `https://www.vrk.lt/statiniai/puslapiai/rinkimai/${tour}/rezultatai`;

const SINGLE_MANDATE_URL = `${BASE_URL()}/rezultataiVienmVrt.json`;

// Multimandate election should be always pulled from firt tour of elections.
const MULTI_MANDATE_URL = `${BASE_URL(
  TOUR_ONE_ELECTION_ID
)}/rezultataiDaugmVrt.json`;

const WIN_PARTICIPANTS = [];

// In case VRK is offline and not accessible, we store and return
// 4 user latest saved data
const request = async <T,>(url: string): Promise<T> => {
  return axios<T>({
    // We get cached values from proxy if something starts not responding,
    // check api server
    url:
      import.meta.env.VITE_APP_BUILD !== "true"
        ? url
        : `https://api2.lrt.lt/vrk/clasificators?url=${url}`,
  })
    .catch(() => {
      return {};
    })
    .then((response) => {
      if ("data" in response) {
        return response?.data as T;
      }

      return response as T;
    });
};

export function App() {
  const [updateDate, setUpdateDate] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [parties, setParties] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [electedParticipants, setElectedParticipants] =
    useState<SingleMandateResponse["data"]["isrinkti"]>();
  const [participants, setParticipants] = useState([]);

  const getData = async () => {
    const singleMandate = await request<SingleMandateResponse>(
      SINGLE_MANDATE_URL
    );

    // Fetch information about elected participants in first tour
    const singleMandateElected = await request<SingleMandateResponse>(
      `${BASE_URL(TOUR_ONE_ELECTION_ID)}/rezultataiVienmVrt.json`
    );

    const multiMandate = await request<MultiMandateResponse>(MULTI_MANDATE_URL);

    const districts = singleMandate.data.biuleteniai.reduce((results, item) => {
      if (item.db_numeris_rikiavimui) {
        results.push({
          name: item.apygarda_en?.substring(item.apygarda_en.indexOf(". ") + 2),
          vicinityCount: item.apylinkiu_sk,
          countedVicinities: item.apylinkiu_pateike_sk,
          rpg_id: item.rpg_id,
        });
      }

      return results;
    }, []);

    const parties = (multiMandate.data.balsai || []).reduce((results, item) => {
      if (item.partija) {
        results.push({
          number: item.saraso_numeris,
          name: item.partija,
          rorg_id: item.rorg_id,
          mandates: parseInt(item.mandatu_skaicius, 10) || 0,
          result: item.proc_nuo_dal_rinkeju, // was in 2020 proc_nuo_gal_biul,
        });
      }
      return results;
    }, []);

    console.log(singleMandate);

    setElectedParticipants([
      ...(singleMandate.data.isrinkti || []),
      ...singleMandateElected.data.isrinkti,
    ]);
    setSelectedDistrict(districts[0].rpg_id);
    setDistricts(districts);

    setUpdateDate(parseISO(singleMandate.header.date));
    setParties(parties);

    const participantsResults = await getPartiesResults(districts);

    setParticipants(participantsResults);
  };

  const getPartiesResults = async (districts) => {
    const districtResults = districts.map(async (item) => {
      const URL = `${BASE_URL()}/rezultataiVienmRpg${item.rpg_id}.json`;
      const response = await request<SingleMandateItemResponse>(URL);

      return response.data.balsai;
    });

    const result = await Promise.all(districtResults);

    return result.flat().concat(WIN_PARTICIPANTS);
  };

  const getDistrict = async (code: string) => {
    const URL = `${BASE_URL()}/rezultataiVienmRpg${code}.json`;

    const response = await request<SingleMandateItemResponse>(URL);

    const results = response.data.balsai.reduce((results, item) => {
      if (item.rknd_id) {
        results.push({
          rorg_id: item.rorg_id,
          rknd_id: item.rknd_id,
          name: item.kandidatas,
          result: item.proc_nuo_dal_rinkeju, // was in 2020 item.proc_nuo_gal_biul,
          party: item.iskelusi_partija,
        });
      }

      return results;
    }, []);

    setSelectedDistrict(code);
    setCandidates(results);
  };

  const handleDistrictChange = async (code: string) => {
    await getDistrict(code);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      getDistrict(selectedDistrict);
    }
  }, [selectedDistrict]);

  return (
    <div className="embd-election-results">
      <div className="embd-election-results__heading">
        Seimo rinkimai 2024 Balsavimo Rezultatai
      </div>

      {/* Depending on election tour, first tour we should show "Mandatu skacius"
       first and for second tour "Vienmandat" first.
      */}
      <Tabs
        tabs={[
          {
            title: "Vienmandatė",
            content: (
              <SingleMandate
                districts={districts}
                selectedDistrict={selectedDistrict}
                updateDate={updateDate}
                candidates={candidates}
                parties={parties}
                onDistrictChange={handleDistrictChange}
              />
            ),
          },
          {
            title: "Mandatų skaičius",
            content: (
              <Parties
                parties={parties}
                participants={participants}
                electedParticipants={electedParticipants}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("election-embed"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
