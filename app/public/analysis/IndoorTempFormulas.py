class IndoorTempFormulas:
    """
    See `design.md`.

    # TODO: move new documentation to `design.md`
    All analysis classes operate on the following assumptions:
    - Time values are represented in app seconds.
    - Temperature values are represented in degrees Fahrenheit.
    - The supplied event map is initialized with all pre-genererated events.
    - There are pre-generated events at the minimum app time that set the initial values for all pieces of smart home state.
    """

    @staticmethod
    def naturalIndoorTempChange(
        indoorTemp: float,
        outdoorTemp: float,
        totalTime: float,
        openDoorTime: float,
        openWindowTime: float,
    ) -> float:
        """
        The indoor temp changes naturally in the following (cumulative) ways:
        - For every 10 deg F difference in outdoor temp, indoor temp changes +/- 2 deg F per hour.
        - For every 10 deg F difference in outdoor temp, indoor temp changes +/- 2 deg F per 5 min of open door time.
        - For every 10 deg F difference in outdoor temp, indoor temp changes +/- 1 deg F per 5 min of open window time.
        """
        baseIndoorChangePerSecPerOutdoorDiff = 2 / (3600 * 10)  # F / s*F
        indoorChangePerOpenDoorSecPerOutdoorDiff = 2 / (60 * 5 * 10)  # F / s*F
        indoorChangePerOpenWindowSecPerOutdoorDiff = 1 / (60 * 5 * 10)  # F / s*F

        outdoorDiff = abs(outdoorTemp - indoorTemp)
        changeDirection = 1 if outdoorTemp > indoorTemp else -1
        baseDegChange = baseIndoorChangePerSecPerOutdoorDiff * totalTime * outdoorDiff
        openDoorDegChange = (
            indoorChangePerOpenDoorSecPerOutdoorDiff * openDoorTime * outdoorDiff
        )
        openWindowDegChange = (
            indoorChangePerOpenWindowSecPerOutdoorDiff * openWindowTime * outdoorDiff
        )
        return changeDirection * (
            baseDegChange + openDoorDegChange + openWindowDegChange
        )

    @staticmethod
    def isHvacRunning(indoorTemp: float, thermostatTemp: float) -> bool:
        """
        HVAC maintains the temp set by the thermostat within 2 deg F; if the indoor
        temp goes beyond 2 deg F of the thermostat temp, HVAC starts running.
        """
        return abs(thermostatTemp - indoorTemp) > 2

    @staticmethod
    def hvacIndoorTempChange(
        indoorTemp: float,
        thermostatTemp: float,
        totalTime: float,
    ) -> float:
        """
        If HVAC is running, it changes the indoor temp by 1 deg F
        per min until it reaches the thermostat temp.
        """
        if not IndoorTempFormulas.isHvacRunning(indoorTemp, thermostatTemp):
            return 0
        changePerSecond = 1 / 60  # F / s
        difference = abs(thermostatTemp - indoorTemp)
        maxPossibleChange = changePerSecond * totalTime
        actualChange = min(difference, maxPossibleChange)
        changeDirection = 1 if thermostatTemp > indoorTemp else -1
        return changeDirection * actualChange

    @staticmethod
    def indoorTemp(
        indoorTemp: float,
        outdoorTemp: float,
        thermostatTemp: float,
        totalTime: float,
        openDoorTime: float,
        openWindowTime: float,
    ) -> float:
        """
        Calculates the new indoor temp of the smart home in deg F based on the previous indoor temp and
        smart home events that have occurred since the last calculation using the following steps:
        - Create an indoor temp variable and initialize it with the previous indoor temp.
        - Calculate the natural indoor temp change and add it to the indoor temp variable.
        - Calculate the HVAC indoor temp change and add it to the indoor temp variable.
        - Return the indoor temp variable.
        """
        indoorTemp += IndoorTempFormulas.naturalIndoorTempChange(
            indoorTemp, outdoorTemp, totalTime, openDoorTime, openWindowTime
        )
        indoorTemp += IndoorTempFormulas.hvacIndoorTempChange(
            indoorTemp, thermostatTemp, totalTime
        )
        return indoorTemp
