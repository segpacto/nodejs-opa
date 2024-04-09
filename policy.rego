package example

default allow_admin := false
default allow_authenticated := false

# Allow access to user data for admin users
allow_admin {
    input.method == "GET"
    input.user.role == "admin"
    startswith(input.path, "/users/")
}

is_working_hours {
    current_time := time.now_ns()
    [hour, minute, second] := time.clock(current_time)
    hour >= 9
    hour < 17
}

# Allow access to order data for all authenticated users
allow_authenticated {
    input.method == "GET"
    input.user.role != ""
    startswith(input.path, "/orders/")
    is_working_hours
}

# Define final allow decision
allow {
    allow_admin
    allow_authenticated
}