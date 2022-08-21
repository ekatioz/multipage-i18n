import { JsonFormsCore } from "@jsonforms/core";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Container, Tab, Tabs } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getNamespaces, getTranslations, saveTranslations } from "./locales";

function App() {
  const { t } = useTranslation(["localization-management"]);
  const [data, setData] = useState<Record<string, string>>({});
  const [changedData, setChangedData] = useState<typeof data>({});
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [selectedNamespaceIndex, selectNamespace] = useState(0);

  const selectedNamespace = useMemo(
    () => namespaces[selectedNamespaceIndex],
    [namespaces, selectedNamespaceIndex]
  );

  useEffect(() => {
    const { promise, cancel } = getNamespaces();
    promise.then(({ canceled, data }) => {
      if (canceled || !data) return;
      setNamespaces(data);
    });
    return cancel;
  }, []);

  useEffect(() => {
    if (!selectedNamespace) return;
    const { promise, cancel } = getTranslations(selectedNamespace);
    promise.then(({ canceled, data }) => {
      if (canceled || !data) return;
      setData(data);
      setChangedData(data);
    });
    return cancel;
  }, [selectedNamespace]);

  function onChange({ data }: Pick<JsonFormsCore, "data">) {
    setChangedData(data);
  }

  function onSave() {
    saveTranslations(selectedNamespace, changedData).then(() =>
      setData(changedData)
    );
  }

  return (
    <div className="App">
      <Box sx={{ borderBottom: 1 }}>
        <Tabs
          value={selectedNamespaceIndex}
          onChange={(_, index) => selectNamespace(index)}
        >
          {namespaces.map((namespace) => (
            <Tab label={namespace} key={namespace} />
          ))}
        </Tabs>
      </Box>
      <Container sx={{ margin: "1em auto 0", maxWidth: "600px" }}>
        {data && (
          <>
            <JsonForms
              data={data}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={(state) => onChange(state)}
            />
            <Box
              display="flex"
              justifyContent="flex-end"
              gap="1em"
              marginTop="1em"
            >
              <Button variant="outlined" onClick={() => setData({ ...data })}>
                {t("reset")}
              </Button>
              <Button variant="contained" onClick={onSave}>
                {t("save")}
              </Button>
            </Box>
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
