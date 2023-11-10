/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
import pluginId from "../../pluginId";
import {
  Layout,
  Box,
  Flex,
  Button,
  Alert,
  EmptyStateLayout,
} from "@strapi/design-system";
import axios from "axios";
const BASE_URL = process.env.STRAPI_ADMIN_BACKEND_URL;

function HomePage() {
  const [value, setValue] = React.useState();
  /* Fetch the data */
  async function convertFiledName() {
    const changeNames = await axios.get(`${BASE_URL}/${pluginId}/update-label`);
    // console.log(changeNames);
    setValue(changeNames.data);
  }
  async function handleClose() {
    setValue("");
  }
  /** set the data */
  React.useEffect(() => {
    let timeoutId;

    if (value) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value]);
  return (
    <Box padding={10} background="neutral100">
      <Layout>
        <EmptyStateLayout
          content={
            <Flex gap={8} alignItems="center">
              <Button variant="secondary" onClick={convertFiledName}>
                Update the field labels
              </Button>
            </Flex>
          }
        ></EmptyStateLayout>
        <Box padding={8}>
          <Flex direction="column" alignItems="center" spacing={1} justifyContent="center">
            {value === true && (
              <Alert
                closeLabel="Close"
                title="Successfully update the labels."
                variant="success"
                onClose={handleClose}
              ></Alert>
            )}
          </Flex>
        </Box>
      </Layout>
    </Box>
  );
}

export default memo(HomePage);
