class MathEngine:
    def __init__(self, conversion_factors=None):
        """
        Initialize with a dictionary mapping (from_unit, to_unit) -> multiplier.
        E.g., {("MW", "kW"): 1000.0, ("GWh", "ktoe"): 0.086}
        """
        self.factors = conversion_factors or {}

    def load_factors_from_db(self, db_factors):
        """
        Load factors from a list of ConversionFactor DB objects.
        """
        self.factors = {(f.from_unit, f.to_unit): f.multiplier for f in db_factors}

    def convert(self, value: float, from_unit: str, to_unit: str) -> float:
        if from_unit == to_unit:
            return value
            
        key = (from_unit, to_unit)
        if key in self.factors:
            return value * self.factors[key]
            
        # Try reverse mapping if inverse exists
        reverse_key = (to_unit, from_unit)
        if reverse_key in self.factors:
            return value / self.factors[reverse_key]
            
        raise ValueError(f"No conversion factor found for {from_unit} to {to_unit}")

    def calculate_emissions(self, consumption_mwh: float, grid_emission_factor: float) -> float:
        """
        Calculate total emissions in tCO2.
        Formula: Emissions = Activity Data * Emission Factor
        """
        return consumption_mwh * grid_emission_factor
        
    def calculate_energy_balance(self, primary_supply: float, transformations: float, losses: float) -> float:
        """
        Calculates the theoretical final consumption based on the energy balance principle:
        Final Consumption = Total Primary Energy Supply - Transformation - Losses
        """
        return primary_supply - transformations - losses
