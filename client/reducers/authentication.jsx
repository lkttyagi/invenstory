import initialState from '../store/initialState'
import { UPDATE_AUTHENTICATION } from '../actionTypes'

/**
 * Reducer for checking authentication status
 * @function authenticationReducer
 * @param {Object} state
 * @param {string} action
 * @return new value for this store property or default state
 */
export default function(state = initialState, action) {

  switch(action.type){
    case UPDATE_AUTHENTICATION:
      return action.data
      break

    default:
      return state
  }
}