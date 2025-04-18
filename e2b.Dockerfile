FROM e2bdev/code-interpreter:latest

RUN pip install numpy pandas scikit-learn matplotlib seaborn
RUN npm install --global lodash axios
RUN pip install yfinance