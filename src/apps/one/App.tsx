import Button from "@/components/button/button";
import Headline from "@/components/headline/headline";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation(["app-one", "common"]);
  console.log(i18n);

  return (
    <div className="App">
      <Headline caption={t("headline")} />
      <Button caption={t("hello")} />
    </div>
  );
}

export default App;
