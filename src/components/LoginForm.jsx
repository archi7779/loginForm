import React from 'react';
import { Field, Form, Formik, FieldArray } from 'formik';
import { Input } from 'antd';
import * as yup from 'yup';
import classNames from 'classnames';
import axios from 'axios';
import * as _ from 'lodash';

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
  password: yup.string().required('Please Enter your password'),
  // .matches(
  //     "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
  //     "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
  // )
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
          onSubmit={(data, { setSubmitting }) => {
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
                // resetForm() kak sdelat'?
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
                <Field
                  name="name"
                  type="input"
                  as={Input}
                  placeholder="enter ur name"
                  className={classNames({ inputError: errors.name })}
                />
                {errors.name && touched.name ? <div>{errors.name}</div> : null}
                <Field
                  name="password"
                  type="password"
                  as={Input}
                  placeholder="enter ur password"
                  className={classNames({ inputError: errors.password })}
                />
                {errors.password && touched.password ? <div>{errors.password}</div> : null}
                <Field
                  name="repeatPassword"
                  type="password"
                  as={Input}
                  placeholder="repeat ur password"
                  className={classNames({ inputError: errors.repeatPassword })}
                />
                {errors.repeatPassword && touched.repeatPassword ? (
                  <div>{errors.repeatPassword}</div>
                ) : null}
                <Field
                  name="email"
                  type="input"
                  as={Input}
                  placeholder="enter ur email"
                  className={classNames({ inputError: errors.email })}
                />
                {errors.email && touched.email ? <div>{errors.email}</div> : null}

                <Field
                  name="website"
                  type="input"
                  as={Input}
                  placeholder="enter ur website"
                  className={classNames({ inputError: errors.website })}
                />
                {errors.website && touched.website ? <div>{errors.website}</div> : null}
                <Field
                  name="age"
                  type="input"
                  as={Input}
                  placeholder="enter ur age"
                  className={classNames({ inputError: errors.age })}
                />
                {errors.age && touched.age ? <div>{errors.age}</div> : null}
                <FieldArray name="skills">
                  {arrayHelpers => (
                    <div className="fieldArr">
                      <Field
                        name="skills[0]"
                        type="input"
                        as={Input}
                        placeholder="enter ur skill"
                        key={0}
                      />
                      {values.skills.slice(1).map((item, index) => (
                        <Field
                          name={`skills[${index + 1}]`}
                          type="input"
                          as={Input}
                          placeholder="enter ur skill"
                          key={_.uniqueId()}
                        />
                      ))}
                      <button type="button" onClick={() => arrayHelpers.push()}>
                        Add Skill
                      </button>
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
                <button type="submit">sub</button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    );
  }
}
