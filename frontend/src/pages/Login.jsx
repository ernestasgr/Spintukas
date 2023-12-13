import { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import config from "../config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        username: formData.username,
        password: formData.password,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(`${config.backendUrl}/login`, options);

      let isError = false;
      let message = "Login successful";

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
          message = "There was an error logging in";
        }
      } else {
        const data = await response.json();
        console.log(data.access_token);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("is_admin", data.is_admin);
      }

      toast({
        title: message,
        status: isError ? "error" : "success",
        duration: 9000,
        isClosable: true,
      });
      if (!isError) {
        navigate("/main");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast({
        title: "An error occurred while processing your request",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={4} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" mb={4} textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
        </FormControl>
        <Button type="submit" colorScheme="blue">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
