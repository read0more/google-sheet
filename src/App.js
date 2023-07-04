import { useContext } from "react";
import { useIntl } from "react-intl";
import { I18nContext } from "./I18nProvider";

function App() {
  const { formatMessage } = useIntl();
  const { switchLanguage } = useContext(I18nContext);
  console.log(switchLanguage);

  return (
    <div className='App'>
      <button
        onClick={() => {
          switchLanguage("ko");
        }}
      >
        switch ko
      </button>
      <button
        onClick={() => {
          switchLanguage("en");
        }}
      >
        switch en
      </button>
      <button
        onClick={() => {
          switchLanguage("jp");
        }}
      >
        switch jp
      </button>
      <h2>
        {formatMessage({
          id: "common.grid",
        })}
      </h2>
    </div>
  );
}

export default App;
