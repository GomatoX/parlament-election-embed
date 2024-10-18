export type ResponseHeader = {
  resource: string;
  date: string;
  hash: string | number;
};

export type CandidateBase = {
  kandidatas: string;
  apygarda: string;
  iskele: string;
  rknd_id: string;
  rpg_id: string;
};

export type BiuletenisBase = {
  apygarda_en: string;
  apylinkiu_sk: string;
  apylinkiu_pateike_sk: string;
  viso_rinkeju: string;
  viso_dalyvavo: string;
  viso_dalyvavo_proc: string;
  negaliojanciu: string;
  negaliojanciu_proc: string;
  galiojanciu: string;
  galiojanciu_proc: string;
  rt_id: string;
  rpg_id: string;
  db_proc_rikiavimui: string;
  db_numeris_rikiavimui: string;
  ar_uzsienio: string;
};

export type SingleMandateData = {
  bendraInfo: {
    apygardu_viso: string;
    apylinkiu_viso: string;
    apygardu_sk_pateike: string;
    apylinkiu_sk_pateike: string;
    viso_rinkeju: string;
    viso_dalyvavo: string;
    viso_dalyvavo_proc: string;
    ar_dalyvavo_puse: string;
    negaliojanciu: string;
    negaliojanciu_proc: string;
    galiojanciu: string;
    galiojanciu_proc: string;
    pateike_rink_sudaro_proc: string;
  };
  isrinkti: (CandidateBase & { rpg_numeris: string })[];
  dalyvausPakartotiniame: (CandidateBase & {
    is_viso: string;
    proc_nuo_gal_biul: string;
  })[];
  biuleteniai: (BiuletenisBase & {
    apylinkiu_pateike_sk_d: string;
    apylinkiu_pateike_sk_pb: string;
    negaliojanciu_proc_d: string;
    galiojanciu_proc_d: string;
    biuleteniu_su_pb_proc: string;
  })[];
};

// Response Types
export type SingleMandateResponse = {
  date: Date;
  header: ResponseHeader;
  data: SingleMandateData;
};

export type SingleMandateItemResponse = {
  date: Date;
  header: ResponseHeader;
  data: {
    balsai: {
      balsadezese: string;
      is_viso: string;
      kandidatas: string;
      pastu: string;
      proc_nuo_dal_rinkeju: string;
      proc_nuo_gal_biul: string;
      proc_nuo_rinkeju: string;
      iskelusi_partija: string;
      rknd_id: string;
      rorg_id: string;
      rrv_isrinktas: string;
    }[];
    biuleteniai: (BiuletenisBase & {
      apylinke_en: string;
      rpl_id: string;
    })[];
  };
};

export type MultiMandateResponse = {
  date: Date;
  header: ResponseHeader;
  data: {
    balsai: {
      saraso_numeris: string;
      partija: string;
      rorg_id: string;
      balsadezese: string;
      pastu: string;
      is_viso: string;
      mandatu_skaicius: string;
      proc_nuo_gal_biul: string;
      proc_nuo_dal_rinkeju: string;
      proc_nuo_rinkeju: string;
    }[];
    biuleteniai: BiuletenisBase[];
  };
};

export type DistrictType = {
  name: string;
  vicinityCount: number;
  countedVicinities: number;
  rpg_id: string;
  rorg_id: string;
};

export type PartyType = {
  number: number;
  name: string;
  rorg_id: string;
  mandates: number;
  result: number;
};

export type CandidateType = {
  rorg_id: string;
  rknd_id: string;
  name: string;
  result: number;
  party: string;
  proc_nuo_gal_biul: string;
};
