package com.example.server.security.config;


import com.example.server.model.Role;
import com.example.server.model.User;
import com.example.server.security.jwttoken.JwtService;
import com.example.server.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter class in order to prevent an unauthenticated user to make calls to certain
 * endpoints from the app
 * Checks if the Bearer token attached to the HTTP request is valid and not expired, or if it's present
 */
@Component
@RequiredArgsConstructor
public class TokenFilter extends OncePerRequestFilter {
    /**
     * Parameter used to manipulate the tokens and validate/generate them
     */

    private final JwtService jwtService;

    /**
     * User service, from which we can obtain details about the validity of the token and generate new ones
     */

    private final UserService userService;

    /**
     * The filter method
     *
     * @param request     the HTTP request which comes to the app
     * @param response    the response of the app to the request
     * @param filterChain the chains of filter which still need to be executed
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }

            String userEmail = jwtService.extractUserEmail(token);
            User userDetails = userService.findByEmail(userEmail);
            if (!jwtService.isTokenValid(token, userDetails)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            }

            //for modify path only admin can access
            String path = request.getServletPath();
            if(path.contains("/classrooms")){
                if(!userDetails.getRole().equals(Role.ADMIN)){
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                }
            }


        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        filterChain.doFilter(request, response);

    }

    /**
     * Method which marks the endpoins which don't need to be checked such as /login
     *
     * @param request current HTTP request
     * @return true if the endpoint is in the path, else false
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return path.contains("/login") || path.contains("/register") || request.getMethod().equals("OPTIONS");
    }
}
