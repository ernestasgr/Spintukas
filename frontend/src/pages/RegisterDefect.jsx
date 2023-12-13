import { useState } from "react";
import config from "../config";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Heading,
  Textarea,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";

export const RegisterDefect = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [image, setImage] = useState(null);

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", location);
    formData.append("severity", severity);
    formData.append("image", image);

    const options = {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("access_token")}`,
      },
      body: formData,
    };

    const response = await fetch(
      `${config.backendUrl}/register_defect`,
      options
    );

    let isError = false;
    let message = "Defect registration successful";

    if (!response.ok) {
      isError = true;
      try {
        const errorData = await response.json();
        console.log(errorData);
        if (errorData && errorData.message) {
          message = errorData.message;
        } else {
          throw new Error("Unknown error occurred");
        }
      } catch (error) {
        message = "There was an error registering your defect";
      }
    }

    toast({
      title: message,
      status: isError ? "error" : "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="sm" m="auto" p="4">
      <Heading as="h2" mb="4">
        Create Furniture Defect
      </Heading>
      <form onSubmit={handleSubmit}>
        <Box mb="4">
          <label>Description:</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            resize="vertical"
            placeholder="Enter description..."
          />
        </Box>
        <Box mb="4">
          <label>Location:</label>
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
          />
        </Box>
        <Box mb="4">
          <label>Severity:</label>
          <Select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            placeholder="Select severity"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </Box>
        <Box mb="4">
          <label>Image:</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Box>
        <Button colorScheme="blue" type="submit">
          Create Defect
        </Button>
      </form>
    </Box>
  );
};
