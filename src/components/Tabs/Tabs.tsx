import { FC, useState } from "react";

type TabsProps = {
  tabs: {
    title: string;
    content: React.ReactNode;
  }[];
};

const Tabs: FC<TabsProps> = ({ tabs }) => {
  const [view, setView] = useState(0);

  const handleChangeView = (view: number) => () => {
    setView(view);
  };

  return (
    <>
      <div className="embd-election-results__views">
        {tabs.map((tab, index) => (
          <button
            key={`tab-${index}`}
            type="button"
            className={view === index && "active"}
            onClick={handleChangeView(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div>{tabs[view].content}</div>
    </>
  );
};

export default Tabs;
