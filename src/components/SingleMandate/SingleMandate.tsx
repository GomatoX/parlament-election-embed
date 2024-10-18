import { FC, useState } from "react";
import LastUpdate from "../LastUpdate";
import ArrowIcon from "../ArrowIcon";
import { CandidateType, DistrictType, PartyType } from "../../types";
import { ACTIVE_ELECTION_ID } from "../..";

type SingleMandateProps = {
  districts: DistrictType[];
  selectedDistrict: string;
  updateDate: string;
  candidates: CandidateType[];
  parties: PartyType[];
  onDistrictChange: (code: string) => void;
};

const SingleMandate: FC<SingleMandateProps> = ({
  districts,
  selectedDistrict,
  updateDate,
  candidates,
  parties,
  onDistrictChange,
}) => {
  const IMAGE_URL = `https://www.vrk.lt/statiniai/puslapiai/rinkimai/${ACTIVE_ELECTION_ID}`;

  const [isShowingAll, setIsShowingAll] = useState(false);

  const handleShowAll = () => {
    setIsShowingAll(!isShowingAll);
  };

  const handleDistrictChange =
    (next = true) =>
    () => {
      const currentDistrictIndex = districts.findIndex(
        (item) => item.rpg_id === selectedDistrict
      );

      if (next && !!districts[currentDistrictIndex + 1]) {
        const code = districts[currentDistrictIndex + 1].rpg_id;
        onDistrictChange(code);
      }

      if (!next && currentDistrictIndex !== 0) {
        const code = districts[currentDistrictIndex - 1].rpg_id;
        onDistrictChange(code);
      }
    };

  const isButtonDisabled = (next = true) => {
    const currentDistrictIndex = districts.findIndex(
      (item) => item.rpg_id === selectedDistrict
    );

    if (next) {
      return !districts[currentDistrictIndex + 1];
    }

    if (!next) {
      return currentDistrictIndex === 0;
    }

    return false;
  };

  return (
    <>
      {districts.length > 0 && (
        <div className="embd-election-results__navigation">
          <button
            type="button"
            disabled={isButtonDisabled(false)}
            onClick={handleDistrictChange(false)}
          >
            <ArrowIcon left={true} />
          </button>
          <div className="embd-election-results__navigation-select">
            <span>
              {districts.find((item) => item.rpg_id === selectedDistrict)?.name}
            </span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_391_8028"
                style="mask-type:alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="17"
                height="17"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.79289 5.79289C3.18342 5.40237 3.81658 5.40237 4.20711 5.79289L8.5 10.0858L12.7929 5.79289C13.1834 5.40237 13.8166 5.40237 14.2071 5.79289C14.5976 6.18342 14.5976 6.81658 14.2071 7.20711L9.20711 12.2071C8.81658 12.5976 8.18342 12.5976 7.79289 12.2071L2.79289 7.20711C2.40237 6.81658 2.40237 6.18342 2.79289 5.79289Z"
                  fill="black"
                />
              </mask>
              <g mask="url(#mask0_391_8028)">
                <rect x="0.5" y="0.5" width="16" height="16" fill="black" />
              </g>
            </svg>

            <select
              value={selectedDistrict}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                const code = event.currentTarget.value;
                onDistrictChange(code);
              }}
            >
              {districts.map((item) => (
                <option value={item.rpg_id} key={item.rpg_id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={isButtonDisabled(true)}
            onClick={handleDistrictChange(true)}
          >
            <ArrowIcon />
          </button>
        </div>
      )}

      {candidates
        .slice(0, isShowingAll ? candidates.length : 2)
        .map((item, index) => {
          const party = parties.find((pitem) => pitem.rorg_id === item.rorg_id);
          return (
            <div
              className="embd-election-results__participant_item"
              key={`candidate_${index}`}
            >
              <div className="embd-election-results__participant_item_image">
                <img
                  src={`${IMAGE_URL}/mobKand/img/v_${item.rknd_id}.jpg`}
                  alt=""
                />
              </div>
              <span
                style={{
                  width: `${item.result}%`,
                }}
              ></span>

              <div className="embd-election-results__participant_item_pimage">
                {party && (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/assets/images/${
                      party.number
                    }.png`}
                    alt=""
                  />
                )}
              </div>

              <div>{item.name}</div>

              <div className="embd-election-results__participant_item_result">
                {item.result} %
              </div>
            </div>
          );
        })}

      {candidates.length === 0 && (
        <div className="mt-4 mb-4">Balsai skaičiuojami</div>
      )}

      {candidates.length > 2 && (
        <div>
          <button
            className="embd-election-results__show-all"
            type="button"
            onClick={handleShowAll}
          >
            {isShowingAll ? "Rodyti mažiau" : "Rodyti daugiau"}
          </button>
        </div>
      )}

      <LastUpdate
        districts={districts}
        district={selectedDistrict}
        updateDate={updateDate}
      />
    </>
  );
};

export default SingleMandate;
