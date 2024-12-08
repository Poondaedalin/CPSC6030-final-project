# Final Project

## Github Page Link

https://poondaedalin.github.io/CPSC6030-final-project/

### 1. **Visualization 1: Detailed Scatter Plot**

**Attributes Involved**:

- **X-axis**: `Model Year`
- **Y-axis**: `Electric Range`
- **Color**: `Electric Vehicle Type` (differentiating BEV and PHEV)
- **Tooltip**: Displays `Make`, `Model`, `Model Year`, `Electric Vehicle Type`, and `Electric Range`

**Visual Channels**:

- **Position**: Used for both `Model Year` (horizontal) and `Electric Range` (vertical) to represent each record precisely.
- **Color**: Represents the `Electric Vehicle Type` to help users distinguish between BEVs and PHEVs.
- **Tooltip**: Provides detailed information on hover for individual exploration.

**Expected Pattern**:

- The scatter plot will show the distribution of electric vehicles across different years and their ranges. Users should be able to identify clusters of vehicles with high or low ranges and the trend of EVs improving over time.

**Question Addressed**:

- *How have electric vehicles' ranges evolved over time, and what types of EVs (BEV or PHEV) are more prevalent in specific years?*

**Alternative Design Considered**:

- **Alternative**: A bubble chart that sizes marks based on another attribute (e.g., MSRP).
- **Chosen Design**: The simple scatter plot was chosen for clarity and direct representation of `Model Year` vs. `Electric Range`, which emphasizes the trend analysis.

### 2. **Visualization 2: Aggregated Bar Chart**

**Attributes Involved**:

- **X-axis**: `Model Year`
- **Y-axis**: Count of vehicles
- **Color**: `Electric Vehicle Type` to show the proportion of BEVs vs. PHEVs per year

**Visual Channels**:

- **Position**: Used on the X and Y axes to display counts per `Model Year`.
- **Color**: Indicates the type of electric vehicle.
- **Height**: Represents the count of vehicles per year.

**Expected Pattern**:

- The bar chart will show the adoption of electric vehicles over time, highlighting which types (BEV or PHEV) were more popular in each year.

**Question Addressed**:

- *What is the distribution of electric vehicle types over the years, and which years saw the highest growth in adoption?*

**Alternative Design Considered**:

- **Alternative**: A stacked area chart that shows a cumulative trend over the years.
- **Chosen Design**: A bar chart was chosen for its straightforward comparison of counts and clear visual representation of trends.

### 3. **Visualization 3: Interactive Heatmap**

**Attributes Involved**:

- **X-axis**: `Model Year`
- **Y-axis**: `Make`
- **Color Intensity**: Represents the average `Electric Range` for that `Make` and `Model Year`.

**Visual Channels**:

- **Position**: The axes show relationships between the `Make` of the car and the `Model Year`.
- **Color Intensity**: Reflects the average `Electric Range`, making it easy to spot which makes have higher or lower ranges over the years.

**Expected Pattern**:

- The heatmap will highlight which car makes and years have higher electric ranges, allowing users to quickly identify leaders in range technology.

**Question Addressed**:

- *Which car manufacturers have been producing electric vehicles with the highest ranges over the years?*

**Alternative Design Considered**:

- **Alternative**: A matrix chart using bubble sizes to represent the range.
- **Chosen Design**: The heatmap was chosen for better readability and more straightforward interpretation of `Electric Range` across `Makes` and `Model Years`.

### **Building upon Each Visualization**:

- **Visualization 1** starts with a detailed view showing individual data points for each car.
- **Visualization 2** aggregates the data to show yearly trends and serves as a comparative analysis tool.
- **Visualization 3** reduces cardinality further, summarizing the data to focus on the range capabilities by `Make` and `Year`.

### **Future Use as Filters**:

- The bar chart (Visualization 2) and the heatmap (Visualization 3) can be made interactive to act as filters for the scatter plot (Visualization 1). Users could click on a specific year or make to see detailed data points in the scatter plot that correspond to the selected filter.

### Todo List

- [x] Reorganize/rescale the graph so that it all fits on-screen at the same time (probably do this first)

- [ ] Modify the scatter plot to not show duplicate points (this is causing a lot of lag, especially on the "All Makes" setting)
- [x] Reduce the opacity of null values in the heatmap to make the changing values stick out more
- [ ] Change the color scale for the heatmap to not be orange or blue (I changed it to green on my end and it looks pretty good, so we could try that if y'all want)
- [ ] Add an onclick listener to the heatmap so that the visualization changes to that make when we click a specific row (instead of a drop-down menu)
  - [ ] To that end, we could also make it so that clicking the heatmap while it's focused on a specific make resets it back to "All Makes"
- [ ] Modify the process for setting the "Make" so that the X and Y scale doesn't change (Prof. F seemed pretty insistent on this point)
- [ ] Add titles to the other two graphs (this is on me, I forgot to add title text when I was changing the visualization earlier)