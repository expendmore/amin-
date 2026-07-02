# Production Optimized PHP/Apache Container Setup
FROM php:8.3-apache

# 1. Install System Dependencies & PHP Extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 2. Enable Apache rewrite module
RUN a2enmod rewrite

# 3. Configure Production php.ini settings
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && sed -i 's/session.cookie_secure =.*/session.cookie_secure = 1/g' "$PHP_INI_DIR/php.ini" \
    && sed -i 's/session.cookie_httponly =.*/session.cookie_httponly = 1/g' "$PHP_INI_DIR/php.ini" \
    && sed -i 's/session.cookie_samesite =.*/session.cookie_samesite = "Lax"/g' "$PHP_INI_DIR/php.ini" \
    && sed -i 's/session.gc_maxlifetime =.*/session.gc_maxlifetime = 900/g' "$PHP_INI_DIR/php.ini" \
    && sed -i 's/expose_php =.*/expose_php = Off/g' "$PHP_INI_DIR/php.ini"

# 4. Copy VirtualHost Config
COPY expendmore.conf /etc/apache2/sites-available/000-default.conf

# 5. Set Working Directory
WORKDIR /var/www/html

# 6. Copy Application Source Code
COPY . /var/www/html/

# 7. Establish Production Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod 600 /var/www/html/auth_core/security.log 2>/dev/null || true \
    && chmod 600 /var/www/html/auth_core/mail.log 2>/dev/null || true

# 8. Document Container Port Exposal
EXPOSE 80
