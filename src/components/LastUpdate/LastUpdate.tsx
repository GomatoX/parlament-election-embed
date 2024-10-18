import { FC } from "preact/compat";
import { DistrictType } from "../../types";
import { format } from "date-fns";

type LastUpdateProps = {
  districts: DistrictType[];
  district: DistrictType["rpg_id"];
  updateDate: Date | string;
};

const LastUpdate: FC<LastUpdateProps> = ({
  districts,
  district,
  updateDate,
}) => {
  if (!district) {
    return null;
  }

  const data = districts.find((item) => item.rpg_id === district);

  if (!data) {
    return null;
  }

  return (
    <div className="embd-election-results__info">
      <div className="embd-election-results__counted">
        Suskaičiuota apylinkių <mark>{data.countedVicinities}</mark>
        <span>&nbsp;/ {data.vicinityCount}</span>
      </div>

      {updateDate && (
        <div className="embd-election-results__update">
          Atnaujinta {format(updateDate, "yyyy-MM-dd HH:mm:ss")}
        </div>
      )}
    </div>
  );
};

export default LastUpdate;
