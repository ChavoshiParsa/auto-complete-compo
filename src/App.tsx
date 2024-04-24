import { useEffect, useRef, useState } from "react";
import "./App.css";

type Data = {
  id: number;
  title: string;
};

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedValue, setSelectedValue] = useState<Data>();
  const [filteredData, setFilteredData] = useState<Data[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getData = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const json = await response.json();
      const convertedData = json.map((item: Data) => ({
        id: item.id,
        title: item.title.substring(0, 26),
      }));
      setData(convertedData);
      setFilteredData(convertedData);
      if (inputRef.current && convertedData[0]) {
        setSelectedValue(convertedData[0]);
        inputRef.current.value = convertedData[0].title;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="component-container">
      <div className="input-container">
        <input
          id="user input"
          ref={inputRef}
          type="text"
          onChange={(e) => {
            setIsMenuOpen(true);
            setFilteredData(
              data.filter((item) => item.title.includes(e.target.value.trim()))
            );
          }}
        />
        <button
          onClick={() => {
            setFilteredData(data);
            if (inputRef.current && selectedValue) {
              inputRef.current.value = selectedValue.title;
              inputRef.current.focus();
            }
            setIsMenuOpen((prev) => !prev);
          }}
        >
          <img
            className="arrow"
            src="/public/arrow-down-up.svg"
            alt="arrow down up"
          />
        </button>
      </div>
      {loading && <span className="loader">Loading...</span>}
      {error && <span className="error">{error}</span>}
      {isMenuOpen && (
        <div className="items-container">
          {filteredData.length === 0 ? (
            <div className="no-result">
              <span>Nothing found.</span>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                className="item"
                key={item.id}
                onClick={() => {
                  const foundData = data.find((i) => i.id === item.id);
                  setSelectedValue(foundData);
                  if (inputRef.current && foundData) {
                    inputRef.current.value = foundData.title;
                  }
                  setIsMenuOpen(false);
                }}
              >
                {selectedValue?.id === item.id && (
                  <div className="tick-container">
                    <img className="tick" src="/public/tick.svg" alt="tick" />
                  </div>
                )}
                <span
                  style={{
                    fontWeight: `${selectedValue?.id === item.id && "bold"}`,
                  }}
                >
                  {item.title}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      {isMenuOpen && (
        <div
          className="backdrop"
          onClick={() => {
            if (inputRef.current && selectedValue) {
              inputRef.current.value = selectedValue.title;
            }
            setIsMenuOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
