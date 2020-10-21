import { Component } from 'preact';
import { format, parseISO } from 'date-fns';
import ArrowIcon from './components/ArrowIcon';
import './assets/scss/main.scss';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      updateDate: null,
      selected: null,
      parties: [],
      districts: [],
      candidates: [],
      participants: [],
      view: 1,
    };
  }

  async getDate() {
    const URL = 'https://www.vrk.lt/statiniai/puslapiai/rinkimai/1104/1/1746/rezultatai/rezultataiVienmVrt.json';
    const response = await fetch(URL)
      .then((r) => r.json())
      .catch(() => {
        return JSON.parse(localStorage.getItem(responseMultiURL));
      })
      .then((response) => {
        localStorage.setItem(responseMultiURL, JSON.stringify(response));
        return response;
      });

    const responseMultiURL =
      'https://www.vrk.lt/statiniai/puslapiai/rinkimai/1104/1/1746/rezultatai/rezultataiDaugmVrt.json';
    const responseMulti = await fetch(responseMultiURL)
      .then((r) => r.json())
      .catch(() => {
        return JSON.parse(localStorage.getItem(responseMultiURL));
      })
      .then((response) => {
        localStorage.setItem(responseMultiURL, JSON.stringify(response));
        return response;
      });

    this.setState(
      {
        parties: responseMulti.data.balsai.reduce((results, item) => {
          if (item.partija) {
            results.push({
              number: item.saraso_numeris,
              name: item.partija,
              rpg_id: item.rpg_id,
              rorg_id: item.rorg_id,
              mandates: parseInt(item.mandatu_skaicius, 10) || 0,
              result: item.proc_nuo_dal_rinkeju,
            });
          }
          return results;
        }, []),
        updateDate: format(parseISO(response.header.date), 'yyyy-MM-dd HH:mm:ss'),
        districts: response.data.biuleteniai.reduce((results, item) => {
          if (item.apygarda_en) {
            results.push({
              name: item.apygarda_en?.substring(item.apygarda_en.indexOf('. ') + 2),
              vicinityCount: item.apylinkiu_sk,
              countedVicinities: item.apylinkiu_pateike_sk,
              rpg_id: item.rpg_id,
              rorg_id: item.rorg_id,
            });
          }

          return results;
        }, []),
      },
      async () => {
        this.handleDistrictSelect({
          target: {
            value: this.state.districts[0].rpg_id,
          },
        });
        this.setState({
          participants: await this.getPartiesResults(),
        });
      }
    );
  }

  async componentDidMount() {
    await this.getDate();
  }

  hanldeDistrictClickChange = (side = 1) => () => {
    const { selected, districts } = this.state;
    const index = districts.findIndex((item) => item.rpg_id === selected);

    if (!!districts[index + side] && index + side >= 0) {
      this.setState(
        {
          selected: districts[index + side].rpg_id,
        },
        () => {
          this.handleDistrictSelect({
            target: {
              value: districts[index + side].rpg_id,
            },
          });
        }
      );
    }
  };

  handleDistrictSelect = async (event) => {
    this.setState({
      selected: event.target.value,
    });
    const URL = `https://www.vrk.lt/statiniai/puslapiai/rinkimai/1104/1/1746/rezultatai/rezultataiVienmRpg${event.target.value}.json`;
    const response = await fetch(URL)
      .then((r) => r.json())
      .catch(() => {
        return JSON.parse(localStorage.getItem(URL));
      })
      .then((response) => {
        localStorage.setItem(URL, JSON.stringify(response));
        return response;
      });

    this.setState({
      candidates: response.data.balsai.reduce((results, item) => {
        if (item.rknd_id) {
          results.push({
            rorg_id: item.rorg_id,
            rknd_id: item.rknd_id,
            name: item.kandidatas,
            result: item.proc_nuo_dal_rinkeju,
            party: item.iskelusi_partija,
          });
        }

        return results;
      }, []),
    });
  };

  async getPartiesResults() {
    const districtResults = await this.state.districts.map(async (item) => {
      const URL = `https://www.vrk.lt/statiniai/puslapiai/rinkimai/1104/1/1746/rezultatai/rezultataiVienmRpg${item.rpg_id}.json`;
      const response = await fetch(URL)
        .then((r) => r.json())
        .catch(() => {
          return JSON.parse(localStorage.getItem(URL));
        })
        .then((response) => {
          localStorage.setItem(URL, JSON.stringify(response));
          return response;
        });

      // localStorage.setItem()

      return response.data.balsai;
    });

    const result = await Promise.all(districtResults);

    return result.flat();
  }

  render() {
    const selectedDistrict = this.state.districts.find((item) => item.rpg_id === this.state.selected);

    return (
      <div className="election-results">
        <h1>Balsavimo rezultatai</h1>

        <div className="election-results__views">
          <button
            type="button"
            className={this.state.view === 1 && 'active'}
            onClick={() => {
              this.setState({
                view: 1,
              });
            }}
          >
            Vienmandatė
          </button>
          <button
            className={this.state.view === 2 && 'active'}
            onClick={() => {
              this.setState({
                view: 2,
              });
            }}
          >
            Daugmandatė
          </button>
        </div>

        {this.state.view === 1 && (
          <>
            <div className="election-results__navigation">
              <button type="button" onClick={this.hanldeDistrictClickChange(-1)}>
                <ArrowIcon left={true} />
              </button>
              <select value={this.state.selected} onChange={this.handleDistrictSelect}>
                {this.state.districts.map((item) => (
                  <option value={item.rpg_id} key={item.rpg_id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button type="button" onClick={this.hanldeDistrictClickChange()}>
                <ArrowIcon />
              </button>
            </div>

            {this.state.candidates.map((item, index) => {
              const party = this.state.parties.find((pitem) => pitem.rorg_id === item.rorg_id);
              return (
                <div className="election-results__participant_item" key={`candidate_${index}`}>
                  <div className="election-results__participant_item_image">
                    <img
                      onError={(event) => {
                        event.target.style.display = 'none';
                      }}
                      src={`https://www.vrk.lt/statiniai/puslapiai/rinkimai/1104/1/1746/mobKand/img/v_${item.rknd_id}.jpg`}
                      alt={item.name}
                    />
                  </div>
                  <span
                    style={{
                      width: `${item.result}%`,
                    }}
                  ></span>

                  {party && (
                    <div className="election-results__participant_item_pimage">
                      <img src={`./assets/images/${party.number}.jpg`} alt="" />
                    </div>
                  )}

                  <div>{item.name}</div>

                  <div className="election-results__participant_item_result">{item.result} %</div>
                </div>
              );
            })}

            {selectedDistrict && (
              <div className="election-results__info">
                <div className="election-results__counted">
                  Suskaičiuota apylinkių <mark>{selectedDistrict.countedVicinities}</mark>
                  <span>&nbsp;/ {selectedDistrict.vicinityCount}</span>
                </div>

                {this.state.updateDate && (
                  <div className="election-results__update">Atnaujinta {this.state.updateDate}</div>
                )}
              </div>
            )}
          </>
        )}

        {this.state.view === 2 && (
          <div className="election-results__list">
            {this.state.parties.reduce((results, item, index) => {
              const participants = this.state.participants.filter(
                (pitem) =>
                  pitem.rorg_id && pitem.rorg_id === item.rorg_id && parseFloat(pitem.proc_nuo_dal_rinkeju) > 50
              );

              const mandates = item.mandates + participants.length;

              if (mandates) {
                results.push(
                  <div className="election-results__item" data-mandates={mandates} key={`party_${index}`}>
                    <img src={`./assets/images/${item.number}.jpg`} alt="" />
                    {item.name}
                    <span
                      style={{
                        width: `${item.result}%`,
                      }}
                    ></span>
                    <div className="election-results__item_result">{item.result} %</div>
                  </div>
                );
              }

              return results;
            }, [])}
          </div>
        )}
      </div>
    );
  }
}
