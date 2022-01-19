export const store_d_routes = (context,Routes) => {
    context.commit('STORE_D_ROUTES',Routes)
}

export const clear_d_routes = ({commit}) => {
    commit('CLEAR_D_ROUTES')
}

