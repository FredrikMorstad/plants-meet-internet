import React, { useState, useContext } from 'react';
import { validateUser } from 'utils/registrationValidator';
import {
  FormControl,
  Input,
  Flex,
  Button,
  Heading,
  useToast,
} from '@chakra-ui/react';
import './registerForm.css';
import { registerUser } from 'api/requests';
import { login } from 'api/auth';
import { AuthenticateContext } from 'context/authProvider';
import { useHistory } from 'react-router';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState<number>();
  const [email, setEmail] = useState('');
  const [date, setDate] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordValidation, setPasswordValidation] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  const history = useHistory();
  const toast = useToast();
  const [regErr, setError] = useState<undefined | string[]>();
  const { setAuthenticated } = useContext(AuthenticateContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const UserPayload = {
      first_name: name,
      last_name: lastName,
      password: password,
      password_validation: passwordValidation,
      email: email,
      username: username,
      mobile_number: mobileNumber,
      date_of_birth: date,
    };

    const errMsg = validateUser(UserPayload);

    if (errMsg.length) {
      setError(errMsg);
      return;
    }

    try {
      await registerUser(UserPayload);
      toast({
        title: 'Successfully registered user!',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    } catch (error) {
      var msg = [''];
      switch (error.statusCode) {
        case 400:
          msg = error.message['detail'];
          break;
        case 409:
          msg = error.message['detail'];
          break;
        default:
          msg = ["Unexpected error, couldn't create user"];
      }
      setError(msg);
      toast({
        title: msg,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
      return;
    }

    try {
      await login(email, password);
      setAuthenticated(true);
      toast({
        title: 'Logged in successfully!',
        status: 'success',
        duration: 7000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to log in!',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    }

    history.push('/');
  };
  return (
    <Flex width="100%" align="center" justifyContent="center" flexDir="column">
      <form onSubmit={handleSubmit}>
        <Heading>Register</Heading>
        <FormControl mt="0.5rem" id="username" isRequired>
          <Input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            autoFocus
          />
        </FormControl>
        <FormControl mt="0.5rem" id="email" isRequired>
          <Input
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e-mail"
          />
        </FormControl>
        <FormControl mt="0.5rem" id="password" isRequired>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </FormControl>
        <FormControl mt="0.5rem" id="passwordValidation" isRequired>
          <Input
            name="passwordValidation"
            type="password"
            value={passwordValidation}
            onChange={(e) => setPasswordValidation(e.target.value)}
            placeholder="Validate password"
          />
        </FormControl>
        <Flex>
          <FormControl mt="0.5rem" id="name" mr="0.25rem">
            <Input
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
            />
          </FormControl>
          <FormControl mt="0.5rem" id="lastName" ml="0.25rem">
            <Input
              name="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </FormControl>
        </Flex>
        <FormControl mt="0.5rem" id="mobileNumber">
          <Input
            name="mobileNumber"
            type="number"
            onChange={(e) => setMobileNumber(parseInt(e.target.value, 10))}
            placeholder="Mobile number"
          />
        </FormControl>
        <FormControl mt="0.5rem" id="date">
          <Input
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="date"
          />
        </FormControl>
        <Button type="submit" value="Submit" width="full" mt="0.5rem">
          Submit
        </Button>
      </form>
      {regErr && (
          <p className="errMsg">{regErr}</p>
      )}
    </Flex>
  );
};

export default RegisterForm;
