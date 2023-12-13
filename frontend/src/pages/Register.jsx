import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import config from "../config";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
    let isError = false;
    let message = "Account created successfully";
    try {
      const body = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(`${config.backendUrl}/register`, options);

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
          message = "There was an error creating your account";
        }
      }

      toast({
        title: message,
        status: isError ? "error" : "success",
        duration: 9000,
        isClosable: true,
      });
      if (!isError) {
        navigate("/login");
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
        Register
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
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
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
          Register
        </Button>
      </form>
    </Box>
  );
};
