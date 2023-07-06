import { createSelector } from "reselect";
import  get from "lodash/get";
import {initialState} from './appReducer';

const selectAppDomain = (state) => (initialState);
const getToken = (subState) => get(subState,'token',null);
const selectToken = () => createSelector(selectAppDomain,getToken);

export {selectToken};