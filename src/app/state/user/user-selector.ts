import { AppState } from "@state/app.state";

export const selectUserState = (state: AppState) => state?.user;