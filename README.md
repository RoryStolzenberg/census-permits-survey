## US Census Bureau [Building Permits Survey](https://www.census.gov/construction/bps/) results [by county](https://www2.census.gov/econ/bps/County/) (or city)

1. Edit file with your preferred county.

2. `docker build -t census .`

3. `docker run -v /path/to/repo/:/data census`

4. Data outputs to `./{$CityName} Census Building Permit Survey.csv`