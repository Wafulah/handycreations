import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const initialize = () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return Promise.resolve();
    }
  
    initialized.current = true;
  
    return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/user/`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(new Error('Failed to fetch user data'));
        }
      })
      .then((user) => {
        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user
        });
      })
      .catch((error) => {
        console.error(error);
        dispatch({
          type: HANDLERS.INITIALIZE
        });
      });
  };
  

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      "id": 1,
      "avatar": "/backend/media/avatars/ID6_6FiClg1.jpg",
      "name": "Handy",
      "email": "handycreations@gmail.com",
      "isAdmin": true
    };
    

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };
  const signIn = (credentials) => {
    
    
    window.sessionStorage.setItem('authenticated', 'true');
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: credentials
        });
    // Function to retrieve the CSRF token from cookies
    // function getCookie(name) {
    //   const value = `; ${document.cookie}`;
    //   const parts = value.split(`; ${name}=`);
    //   if (parts.length === 2) return parts.pop().split(';').shift();
    // }
  
    // const csrftoken = getCookie('csrftoken'); // Retrieve the CSRF token from cookies
    
    // return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login/`,{
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-CSRFToken': csrftoken // Include the CSRF token in the request headers
    //   },
    //   body: JSON.stringify(credentials)
    // })
    //   .then((response) => {
        
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       return Promise.reject(new Error('Invalid credentials'));
    //     }
    //   })
    //   .then((user) => {
    //     window.sessionStorage.setItem('authenticated', 'true');
    //     dispatch({
    //       type: HANDLERS.SIGN_IN,
    //       payload: user
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     throw new Error('Sign-in failed');
    //   });
  };
  
  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
