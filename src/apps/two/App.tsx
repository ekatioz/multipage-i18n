import Button from "@/components/button/button";
import Link from "@/components/link/link";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation(["app-two", "common"]);

  return (
    <div className="App">
      <p>
        {t("hello")} - {t("headline")}
      </p>
      <Button caption={t("button")} />
      <Link caption={t("link")} />
    </div>
  );
}

export default App;
