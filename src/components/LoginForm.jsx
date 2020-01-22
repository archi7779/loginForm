import React from 'react';
import { Field, Form, Formik, FieldArray, useField } from 'formik';
import { Input, Button } from 'antd';
import * as yup from 'yup';
import classNames from 'classnames';
import axios from 'axios';
import * as _ from 'lodash';

function MyInput(props) {
  const [field, meta] = useField(props);
  return (
    <>
      <Input {...field} {...props} />
      {meta.error && meta.touched && <div>{meta.error}</div>}
    </>
  );
}

const validationSchema = yup.object({
  acceptTerms: yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
  name: yup
    .string()
    .required()
    .max(50),
  email: yup
    .string()
    .email()
    .required('Please Enter your Email'),
  website: yup.string().url(),
  age: yup
    .number()
    .moreThan(18)
    .lessThan(65)
    .required(),
  password: yup
    .string()
    .required('Please Enter your password')
    .matches(
      '^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,40}$',
      'Must Contain 8-40 Characters, One Uppercase, , One Number'
    ),
  repeatPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      res: undefined,
      error: undefined,
    };
  }

  render() {
    const { res, error } = this.state;
    return (
      <div className="mainWrapper">
        <Formik
          validateOnChange
          initialValues={{
            name: '',
            password: '',
            repeatPassword: '',
            email: '',
            website: '',
            age: undefined,
            skills: [],
            acceptTerms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(data, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            const skills = _.compact(data.skills);
            const dataToSend = { ...data, skills };
            const sendDataToServer = async () => {
              this.setState({
                res: undefined,
                error: undefined,
              });
              try {
                const response = await axios({
                  method: 'post',
                  url: 'http://localhost:3002/sign-up',
                  data: dataToSend,
                });
                this.setState({ res: response });
                resetForm();
              } catch (err) {
                this.setState({ error: err });
              }
            };
            sendDataToServer();
            setSubmitting(false);
          }}
        >
          {({ values, errors, touched }) => (
            <>
              {res && <div>{res.data}</div>}
              {error && <div className="errorMessage">{error.message}</div>}
              <Form className="loginForm">
                <MyInput
                  name="name"
                  placeholder="enter ur name"
                  className={classNames({ inputError: errors.name && touched.name })}
                />

                <MyInput
                  name="password"
                  placeholder="enter ur password"
                  className={classNames({ inputError: errors.password && touched.password })}
                />

                <MyInput
                  name="repeatPassword"
                  placeholder="repeat ur password"
                  className={classNames({
                    inputError: errors.repeatPassword && touched.repeatPassword,
                  })}
                />

                <MyInput
                  name="email"
                  placeholder="enter ur email"
                  className={classNames({ inputError: errors.email && touched.email })}
                />

                <MyInput
                  name="website"
                  placeholder="enter ur website"
                  className={classNames({ inputError: errors.website && touched.website })}
                />

                <MyInput
                  name="age"
                  placeholder="enter ur age"
                  className={classNames({ inputError: errors.age && touched.age })}
                />

                <FieldArray name="skills">
                  {arrayHelpers => (
                    <div className="fieldArr">
                      <MyInput name="skills[0]" placeholder="enter ur skill" key={0} />
                      {values.skills.slice(1).map((item, index) => (
                        <MyInput
                          name={`skills[${index + 1}]`}
                          placeholder="enter ur skill"
                          /* eslint-disable-next-line react/no-array-index-key */
                          key={index}
                        />
                      ))}
                      <Button
                        type="primary"
                        onClick={() => values.skills[0] && arrayHelpers.push()}
                      >
                        Add Skill
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <label htmlFor="acceptTerms">
                  <Field
                    name="acceptTerms"
                    type="checkBox"
                    as={Input}
                    className={classNames({ inputError: errors.acceptTerms })}
                  />{' '}
                  Accept Terms{' '}
                </label>
                {errors.acceptTerms ? <div>{errors.acceptTerms}</div> : null}
                <Button type="primary" htmlType="submit">
                  sub
                </Button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    );
  }
}
