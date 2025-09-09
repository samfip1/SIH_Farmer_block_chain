import pandas as pd
df = pd.read_csv("data/price_data.csv")

print(df.head(1));

print(df['Grade'].unique());