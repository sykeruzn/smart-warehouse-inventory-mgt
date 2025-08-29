FROM php:8.3-fpm

# Install system deps
RUN apt-get update && apt-get install -y \
    libpq-dev git unzip curl && \
    docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy app
COPY . .

# Install PHP dependencies
RUN composer install

# Laravel permissions (storage/logs, bootstrap/cache)
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["php-fpm"]
