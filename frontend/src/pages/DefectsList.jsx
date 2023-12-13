/* eslint-disable react/prop-types */
import {
  Box,
  Text,
  Image,
  Stack,
  Badge,
  Container,
  Select,
  Checkbox,
  Flex,
  Wrap,
  WrapItem,
  Center,
  Textarea,
  useToast,
  Button,
} from "@chakra-ui/react";
import config from "../config";
import { useState, useEffect } from "react";

export const DefectsList = ({ defects: initialDefects }) => {
  const [sortBy, setSortBy] = useState("");
  const [filterBySeverity, setFilterBySeverity] = useState("");
  const [showUnresolvedOnly, setShowUnresolvedOnly] = useState(false);
  const [defects, setDefects] = useState(initialDefects);
  const [resolutionDetails, setResolutionDetails] = useState("");

  const toast = useToast();

  useEffect(() => {
    setDefects(initialDefects);
  }, [initialDefects]);

  const severityToColor = (severity) => {
    switch (severity) {
      case "Low":
        return "green";
      case "Medium":
        return "yellow";
      case "High":
        return "red";
      default:
        return "gray";
    }
  };

  const resolvedToColor = (resolved) => {
    return resolved ? "green" : "red";
  };

  const toReadableDate = (date) => {
    const parts = date.split("T");
    return parts[0] + " " + parts[1].split(".")[0];
  };

  const sortedDefects = [...defects].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === "severity") {
      const severityOrder = { Low: 1, Medium: 2, High: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return 0;
  });

  const filteredDefects = filterBySeverity
    ? sortedDefects.filter((defect) => defect.severity === filterBySeverity)
    : sortedDefects;

  const defectsToDisplay = showUnresolvedOnly
    ? filteredDefects.filter((defect) => !defect.is_resolved)
    : filteredDefects;

  const updateDefectStatus = async (defectId, status) => {
    const updatedDefects = defects.map((defect) => {
      if (defect.defect_id === defectId) {
        return { ...defect, is_resolved: status };
      }
      return defect;
    });
    setDefects(updatedDefects);

    const body = {
      defect_id: defectId,
      is_resolved: status,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`${config.backendUrl}/update_defect`, options);

    let isError = false;
    let message = "Defect updated successfully";

    if (!response.ok) {
      console.log(response);
      isError = true;
      message = "There was an error updating defect";
    }

    toast({
      title: message,
      status: isError ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const changeResolutionDetails = (defectId, desc) => {
    console.log(desc);
    const updatedDefects = defects.map((defect) => {
      if (defect.defect_id === defectId) {
        return { ...defect, resolution_details: desc };
      }
      return defect;
    });
    setDefects(updatedDefects);
    setResolutionDetails(desc);
  };

  const updateResolutionDetails = async (defectId, desc) => {
    const body = {
      defect_id: defectId,
      resolution_details: desc,
    };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`${config.backendUrl}/update_defect`, options);

    let isError = false;
    let message = "Defect updated successfully";

    if (!response.ok) {
      console.log(response);
      isError = true;
      message = "There was an error updating defect";
    }

    toast({
      title: message,
      status: isError ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Stack spacing={4}>
      <Center>
        <Flex alignItems="center" mb={4}>
          <Box mr={4}>
            <Text>Sort by:</Text>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="createdAt">Created At</option>
              <option value="severity">Severity</option>
            </Select>
          </Box>
          <Box mr={4}>
            <Text>Filter by Severity:</Text>
            <Select
              value={filterBySeverity}
              onChange={(e) => setFilterBySeverity(e.target.value)}
            >
              <option value="">-- Select --</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </Box>
          <Box>
            <Text>Show Unresolved Only:</Text>
            <Checkbox
              checked={showUnresolvedOnly}
              onChange={(e) => setShowUnresolvedOnly(e.target.checked)}
            />
          </Box>
        </Flex>
      </Center>

      <Wrap spacing="30px" justify="center">
        {defectsToDisplay.map((defect) => (
          <WrapItem key={defect.id} width="300px" height="100%">
            <Center>
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                p={4}
                width="100%"
              >
                <Container maxW="lg">
                  <Image
                    src={config.backendUrl + "/media/" + defect.image}
                    alt={`Defect ${defect.id}`}
                    objectFit="cover"
                  />
                </Container>

                <Text fontSize="lg" fontWeight="bold">
                  Description: {defect.description}
                </Text>
                <Text>Location: {defect.location}</Text>
                <Text>
                  Severity:{" "}
                  <Badge colorScheme={severityToColor(defect.severity)}>
                    {defect.severity}
                  </Badge>
                </Text>
                <Text>
                  Resolved:{" "}
                  <Badge colorScheme={resolvedToColor(defect.is_resolved)}>
                    {defect.is_resolved ? "Yes" : "No"}
                  </Badge>
                </Text>
                {localStorage.getItem("is_admin") === "true" && (
                  <Flex alignItems="center">
                    <Checkbox
                      isChecked={defect.is_resolved}
                      onChange={(e) => {
                        updateDefectStatus(defect.defect_id, e.target.checked);
                      }}
                    />
                    <Text ml={2}>Mark as resolved</Text>
                  </Flex>
                )}

                {defect.is_resolved && (
                  <div>
                    <Box mb="4">
                      <label>Resolution Details:</label>
                      <Textarea
                        isDisabled={localStorage.getItem("is_admin") !== "true"}
                        value={defect.resolution_details}
                        onChange={(e) =>
                          changeResolutionDetails(
                            defect.defect_id,
                            e.target.value
                          )
                        }
                        resize="vertical"
                        placeholder="Enter resolution details..."
                      />
                    </Box>
                    {localStorage.getItem("is_admin") === "true" && (
                      <Button
                        colorScheme="green"
                        onClick={() =>
                          updateResolutionDetails(
                            defect.defect_id,
                            resolutionDetails
                          )
                        }
                      >
                        Save
                      </Button>
                    )}
                  </div>
                )}

                <Text>
                  Created At:{" "}
                  {toReadableDate(new Date(defect.created_at).toISOString())}
                </Text>
                {defect.username && <Text>Reported By: {defect.username}</Text>}
              </Box>
            </Center>
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  );
};

export default DefectsList;
