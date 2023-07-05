import React from "react";
import { IntlProvider } from "react-intl";
import messagesKo from "./i18n/ko.json";
import messagesEn from "./i18n/en.json";
import messagesJp from "./i18n/jp.json";

function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key]
    let prefixedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'string') {
      messages[prefixedKey] = value
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey))
    }

    return messages
  }, {})
}

const allMessages = {
  ko: flattenMessages(messagesKo),
  en: flattenMessages(messagesEn),
  jp: flattenMessages(messagesJp),
};

const I18nContext = React.createContext();

class I18nProvider extends React.Component {
  state = {
    locale: "ko",
    messages: allMessages["ko"],
  };

  render() {
    const { children } = this.props;
    const { locale, messages } = this.state;    
    return (
      <I18nContext.Provider
        value={{
          state: this.state,
          switchLanguage: (language) => {
            console.log(language, messages);
            this.setState({
              locale: language,
              messages: allMessages[language],
            });
          },
        }}
      >
        <IntlProvider
          key={locale}
          locale={locale}
          messages={messages}
          defaultLocale="ko"
        >
          {children}
        </IntlProvider>
      </I18nContext.Provider>
    );
  }
}

export { I18nProvider, I18nContext };
