import { JsonFormsCore } from "@jsonforms/core";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Alert, Box, Button, Container, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsyncAbortable, useAsyncCallback } from "react-async-hook";
import { useTranslation } from "react-i18next";
import { getNamespaces, getTranslations, saveTranslations } from "./locales";

function App() {
  const { t } = useTranslation(["localization-management"]);
  const [changedData, setChangedData] = useState<typeof data>();
  const [unchangedData, setUnchangedData] = useState<typeof data>();
  const [selectedNamespaceIndex, selectNamespace] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
    loading: loadingNamespaces,
    error: errorLoadingNamespaces,
    result: namespaces,
  } = useAsyncAbortable(getNamespaces, []);

  const selectedNamespace = useMemo(
    () => namespaces?.[selectedNamespaceIndex],
    [namespaces, selectedNamespaceIndex]
  );

  const { result: data } = useAsyncAbortable(
    async (signal) => {
      if (selectedNamespace === undefined) return;
      return getTranslations(signal, selectedNamespace);
    },
    [selectedNamespace]
  );

  useEffect(() => {
    setChangedData(data);
    setUnchangedData(data);
  }, [data]);

  const onChange = useCallback(
    ({ data }: Pick<JsonFormsCore, "data">) => setChangedData(data),
    []
  );

  const { execute: onSave, loading: isSaving } = useAsyncCallback(async () => {
    if (selectedNamespace === undefined || changedData === undefined) return;
    await saveTranslations(selectedNamespace, changedData);
    setShowSuccessAlert(true);
    setUnchangedData(changedData);
  });

  useEffect(() => {
    const timeout = setTimeout(
      () => showSuccessAlert && setShowSuccessAlert(false),
      1000
    );
    return () => clearTimeout(timeout);
  }, [showSuccessAlert]);

  if (loadingNamespaces) {
    return <div className="App">Loading</div>;
  }

  if (errorLoadingNamespaces) {
    return (
      <div className="App">
        <>Error: {errorLoadingNamespaces}</>
      </div>
    );
  }

  return (
    <div className="App">
      <Box sx={{ borderBottom: 1 }}>
        <Tabs
          value={selectedNamespaceIndex}
          onChange={(_, index) => selectNamespace(index)}
        >
          {namespaces &&
            namespaces.map((namespace) => (
              <Tab label={namespace} key={namespace} />
            ))}
        </Tabs>
      </Box>
      <Container sx={{ margin: "1em auto 0", maxWidth: "600px" }}>
        {unchangedData && (
          <>
            <JsonForms
              data={unchangedData}
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
              <Button
                variant="outlined"
                onClick={() => setUnchangedData({ ...unchangedData })}
              >
                {t("reset")}
              </Button>
              <Button variant="contained" onClick={onSave} disabled={isSaving}>
                {t("save")}
              </Button>
            </Box>
          </>
        )}
      </Container>
      <Box position="absolute" bottom="1em" left="1em" right="1em">
        {showSuccessAlert && <Alert severity="success">{t("success")}</Alert>}
      </Box>
    </div>
  );
}

export default App;
