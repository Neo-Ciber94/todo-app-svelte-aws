
export const routes = {
    login: "/login",
    signup: "/signup",
    confirmEmail: "/confirm_email",
    resendCode: "/resend_code",
    newTodo: "/new",
    editTodo<S extends string>(id: S) {
        return `/edit/${id}` as const;
    }
} as const;