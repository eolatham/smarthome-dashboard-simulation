CREATE SCHEMA IF NOT EXISTS pre_generated_events;

CREATE TYPE integer_state_type AS ENUM ('temp');
CREATE TYPE boolean_state_type AS ENUM (
    'door',
    'window',
    'light',
    'bedRoomTv',
    'livingRoomTv',
    'stove',
    'oven',
    'microwave',
    'refrigerator',
    'dishWasher',
    'shower',
    'bath',
    'bathExhaustFan',
    'clothesWasher',
    'clothesDryer'
);

CREATE TYPE integer_state_key AS ENUM ('outdoorTemp', 'thermostatTemp');
CREATE TYPE boolean_state_key AS ENUM (
    'bedRoom1OverheadLight',
    'bedRoom1Lamp1',
    'bedRoom1Lamp2',
    'bedRoom1Window1',
    'bedRoom1Window2',
    'bedRoom1Tv',
    'bedRoom2OverheadLight',
    'bedRoom2Lamp1',
    'bedRoom2Lamp2',
    'bedRoom2Window1',
    'bedRoom2Window2',
    'bedRoom3OverheadLight',
    'bedRoom3Lamp1',
    'bedRoom3Lamp2',
    'bedRoom3Window1',
    'bedRoom3Window2',
    'bathRoom1OverheadLight',
    'bathRoom1ExhaustFan',
    'bathRoom1Window',
    'bathRoom1Faucet',
    'bathRoom2OverheadLight',
    'bathRoom2ExhaustFan',
    'bathRoom2Window',
    'bathRoom2Faucet',
    'clothesWasher',
    'clothesDryer',
    'frontDoor',
    'backDoor',
    'garageHouseDoor',
    'garageCarDoor1',
    'garageCarDoor2',
    'livingRoomOverheadLight',
    'livingRoomLamp1',
    'livingRoomLamp2',
    'livingRoomTv',
    'livingRoomWindow1',
    'livingRoomWindow2',
    'livingRoomWindow3',
    'kitchenOverheadLight',
    'kitchenStove',
    'kitchenOven',
    'kitchenMicrowave',
    'kitchenRefrigerator',
    'kitchenDishWasher',
    'kitchenWindow1',
    'kitchenWindow2'
);

CREATE TABLE IF NOT EXISTS pre_generated_events.integer_event (
    time integer NOT NULL,
    state_type integer_state_type NOT NULL,
    state_key integer_state_key NOT NULL,
    new_value integer NOT NULL,
    message text NOT NULL,
    PRIMARY KEY (time, state_key)
);
CREATE TABLE IF NOT EXISTS pre_generated_events.boolean_event (
    time integer NOT NULL,
    state_type boolean_state_type NOT NULL,
    state_key boolean_state_key NOT NULL,
    new_value boolean NOT NULL,
    message text NOT NULL,
    PRIMARY KEY (time, state_key)
);
