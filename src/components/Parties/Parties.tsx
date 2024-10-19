import { FC } from "react";
import { CandidateType, PartyType, SingleMandateResponse } from "../../types";

type PartiesProps = {
  parties: PartyType[];
  participants: CandidateType[];
  electedParticipants: SingleMandateResponse["data"]["isrinkti"];
};

const Parties: FC<PartiesProps> = ({ parties, electedParticipants }) => {
  return (
    <div className="embd-election-results__list">
      {parties
        .reduce((results, item) => {
          const entries = electedParticipants.filter((pitem) => {
            return (
              pitem.iskele &&
              pitem.iskele === item.name.replace(`${item.number}. `, "")
            );
          });

          const mandates = item.mandates + entries.length;

          results.push({
            ...item,
            mandates,
          });

          return results;
        }, [])
        .sort((a, b) => (a.mandates > b.mandates ? -1 : 1))
        .map((item, index) => {
          return (
            <div
              className="embd-election-results__item"
              data-mandates={item.mandates}
              key={`party_${index}`}
            >
              {import.meta.env.VITE_APP_BUILD !== "true" && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/assets/images/${
                    item.number
                  }.png`}
                  alt=""
                />
              )}
              {item.name}
              <span
                style={{
                  width: `${item.result}%`,
                }}
              ></span>
              <div className="embd-election-results__item_result">
                {item.result} %
              </div>
            </div>
          );
        })}

      {parties.length === 0 && <div>Balsai skaičiuojami</div>}

      <div className="embd-election-results__parties-info">
        Mandatų skaičius atnaujinamas tiesiogiai pagal vienmandatėje pirmaujantį
        kandidatą.
      </div>
    </div>
  );
};

export default Parties;
