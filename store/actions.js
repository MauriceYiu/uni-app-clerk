import * as types from './mutationTypes';
export default {
  saveNowDeskOrderInfo({commit}, nowDeskOrderInfo) {
    commit(types.SAVE_NOW_DESK_ORDER_INFO, nowDeskOrderInfo);
  },
  saveNowSelDesk({commit}, nowSelDesk) {
    commit(types.SAVE_NOW_SEL_DESK, nowSelDesk);
  },
  setIsAddItem({commit}, isAddItem) {
    commit(types.SET_IS_ADD_ITEM, isAddItem);
  },
  saveOrderIdFirst({commit}, firstOrderId) {
    commit(types.SAVE_FIRST_ORDER_ID, firstOrderId);
  },
  refreshNum({commit}) {
    commit(types.REFRESH_NUM);
  },
}
