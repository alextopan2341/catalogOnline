package com.example.server.security.jwttoken;

import com.example.server.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.internal.Function;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Class used for managing the tokens
 */
@Service
public class JwtService {

    /**
     * The secret key used by the app to generate and decode tokens
     */
    @Value("${token.signing.key}")
    private String jwtSigningKey;

    /**
     * Function to extract the email from the token
     * @param token the token extracted from the request
     * @return the email decoded from the token
     */
    public String extractUserEmail(String token) {
            return extractClaim(token, Claims::getSubject);
    }


    /**
     * function used to generate a new token
     * @param userDetails the user from whom we want to generate a new token
     * @return the token created
     */
    public String generateToken(User userDetails) {
            return generateToken(new HashMap<>(), userDetails);
        }

    /**
     * C\Function to check if a token is valid
     * @param token the token we want to check
     * @param user the user from whom the request came from
     * @return true if the token is still valid, else false
     */
    public boolean isTokenValid(String token, User user) {
            final String email = extractUserEmail(token);
            return (email.equals(user.getEmail())) && !isTokenExpired(token);
        }


    /**
     * Function used to extract a claim from the token
     * @param token the token we want to extract a claim from
     * @param claimsResolvers the function used to extract the claim
     * @return the claim extracted from the token
     * @param <T> the type of the claim
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
            final Claims claims = extractAllClaims(token);
            return claimsResolvers.apply(claims);
        }

    /**
     * Intermediate function used to generate tokens
     * @param extraClaims The claims we want to add to the token as a map of type (claim, type)
     * @param user the user from whom we crate a new token
     * @return the token in a string format
     */
    private String generateToken(Map<String, Object> extraClaims, User user) {

            extraClaims.put("email", user.getEmail());
            return Jwts.builder().setClaims(extraClaims).setSubject(user.getEmail())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + 3000 * 60 *60))
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
        }

    /**
     * Function to check if the date from the token is still valid based on the parameters of the application
     * @param token the token we want to check if is still valid
     * @return true if is still valid, else false
     */
    private boolean isTokenExpired(String token) {
            return extractExpiration(token).before(new Date());
        }

    /**
     * Function to extract the expiration fate from the token
     * @param token the token from which we want to extract the expiration date
     * @return the expiartion date from the token after decode
     */
    private Date extractExpiration(String token) {
            return extractClaim(token, Claims::getExpiration);
        }

    /**
     * Function used to extract all the claims from a token
      * @param token the token from which we want to extract the token
     * @return the claims found
     */
    private Claims extractAllClaims(String token) {
            return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token)
                    .getBody();
        }

    /**
     * Function to get the secret key uset to encode
     * @return the Key used for encoding
     */
    private Key getSigningKey() {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSigningKey);
            return Keys.hmacShaKeyFor(keyBytes);
        }

}
