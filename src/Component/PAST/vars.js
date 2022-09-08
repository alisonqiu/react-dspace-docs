//"transactions__transaction__enslavers__enslaver_alias__identity__principal_location__name", // invalid

export const enslaver_default_list = [
  "id",
  "principal_alias",
  "principal_location__geo_location__name",
  "first_active_year",
  "last_active_year",
  "number_enslaved",
  "alias__transactions__transaction__relation_type__relation_type",
  "alias__transactions__transaction__place__geo_location__name",
  // "alias__transactions__transaction__voyage__voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name",
  // "alias__transactions__transaction__voyage__voyage_itinerary__imp_principal_port_slave_dis__geo_location__name",
  // "alias__transactions__transaction__voyage__id",
  // "alias__transactions__transaction__date_yyyy",
  // "alias__transactions__transaction__voyage__voyage_dates__imp_arrival_at_port_of_dis_yyyy",
  // "alias__transactions__transaction__place__geo_location__name",
  // "enslaver_sources__text_ref",
  // "enslaver_sources__text_ref",
  "alias__transactions__transaction__source__short_ref",
];
export const enslaver_var_list = {
  id: {
    id: null,
  },

  personal_information: {
    principal_alias: null,
    birth_year: null,
    death_year: null,
    father_name: null,
    father_occupation: null,
    mother_name: null,
    first_spouse_name: null,
    first_marriage_date: null,
    second_spouse_name: null,
    second_marriage_date: null,
    probate_date: null,
    will_value_pounds: null,
    will_value_dollars: null,
    will_court: null,
    principal_location__geo_location__name: null,
    number_enslaved: null,
    first_active_year: null,
    last_active_year: null,
  },

  alias__transactions__transaction__source__short_ref: {
    alias__transactions__transaction__source__short_ref: null,
  },

  alias__transactions__transaction: {
    alias__transactions__transaction__relation_type__relation_type: null,
    alias__transactions__transaction__place__geo_location__name: null,
    alias__transactions__transaction__date_yyyy: null,
    alias__transactions__role__role: null,
  },

  alias__transactions__transaction__voyage: {
    alias__transactions__transaction__voyage__id: null,
    alias__transactions__transaction__voyage__voyage_itinerary: {
      alias__transactions__transaction__voyage__voyage_itinerary__imp_principal_region_slave_dis__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_port_voyage_begin__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_region_voyage_begin__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_broad_region_of_slave_purchase__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_principal_port_slave_dis__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_itinerary__imp_broad_region_slave_dis__geo_location__name:
        null,
    },

    alias__transactions__transaction__voyage__voyage_ship: {
      alias__transactions__transaction__voyage__voyage_ship__vessel_construction_place__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_ship__vessel_construction_region__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_ship__registered_place__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_ship__registered_region__geo_location__name:
        null,
      alias__transactions__transaction__voyage__voyage_ship__ship_name: null,
    },

    alias__transactions__transaction__voyage__voyage_dates: {
      alias__transactions__transaction__voyage__voyage_dates__imp_voyage_began_yyyy:
        null,
      alias__transactions__transaction__voyage__voyage_dates__imp_arrival_at_port_of_dis_yyyy:
        null,
    },
  },
};

export const enslaved_default_list = [
  "id",
  "documented_name",
  "age",
  "gender",
  "height",
  //"post_disembark_location__geo_location__name",
  //"voyage__voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name",
  //"voyage__voyage_itinerary__imp_principal_port_slave_dis__geo_location__name",
  //"voyage__voyage_ship__ship_name",
  // "transactions__transaction__voyage__voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name",
  // "transactions__transaction__voyage__voyage_itinerary__imp_principal_port_slave_dis__geo_location__name",
  // "transactions__transaction__voyage__voyage_ship__ship_name",
  // "skin_color",
  // "last_known_year_yyyy",
  // "transactions__transaction__place__geo_location__name",
  "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias",
  //"transactions__transaction__enslavers__role__role",
  // "transactions__transaction__text_ref",
  "transactions__transaction__voyage__id",
];

export const enslaved_var_list = {
  id: {
    id: null,
  },
  personal_information: {
    documented_name: null,
    // name_first: null,
    // name_second: null,
    // name_third: null,
    modern_name: null,
    age: null,
    gender: null,
    height: null,
    skin_color: null,
    last_known_year_yyyy: null,
    dataset: null,
    notes: null,
    language_group: null,
  },

  post_disembark_location__geo_location__name: {
    post_disembark_location__geo_location__name: null,
  },

  captive_status: {
    captive_status__name: null,
  },

  voyage: {
    voyage__voyage_itinerary: {
      voyage__voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name:
        null,
      voyage__voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name:
        null,
      voyage__voyage_itinerary__imp_broad_region_of_slave_purchase__geo_location__name:
        null,
      voyage__voyage_itinerary__imp_principal_port_slave_dis__geo_location__name:
        null,
      voyage__voyage_itinerary__imp_principal_region_slave_dis__geo_location__name:
        null,
      voyage__voyage_itinerary__imp_broad_region_slave_dis__geo_location__name:
        null,
    },
    voyage__voyage_dates__imp_arrival_at_port_of_dis_yyyy: null,
    voyage__voyage_ship__ship_name: null,
  },

  transactions: {
    transactions__transaction__date_yyyy: null,
    transactions__transaction__amount: null,
    transactions__transaction__place__geo_location__name: null,
    transactions__transaction__enslavers__enslaver_alias__identity__principal_alias:
      null,
    //transactions__transaction__enslavers__role__role: null,
    transactions__transaction__text_ref: null,
  },

  transactions__transaction__voyage: {
    transactions__transaction__voyage__id: null,
    transactions__transaction__voyage__voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name:
      null,
    transactions__transaction__voyage__voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name:
      null,
    transactions__transaction__voyage__voyage_itinerary__imp_broad_region_of_slave_purchase__geo_location__name:
      null,
    transactions__transaction__voyage__voyage_itinerary__imp_principal_region_slave_dis__geo_location__name:
      null,
    transactions__transaction__voyage__voyage_itinerary__imp_principal_port_slave_dis__geo_location__name:
      null,
    transactions__transaction__voyage__voyage_itinerary__imp_broad_region_slave_dis__geo_location__name:
      null,
    transactions__transaction__voyage__voyage_ship__ship_name: null,
  },
};
