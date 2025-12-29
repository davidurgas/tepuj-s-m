<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Brand -->
            <div class="footer-brand">
                <?php if (has_custom_logo()): ?>
                    <?php the_custom_logo(); ?>
                <?php else: ?>
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png" alt="<?php bloginfo('name'); ?>" class="footer-logo">
                <?php endif; ?>
                <p class="footer-description">
                    Profesionálne tepovanie vo vašich rukách. Prenajmite si kvalitný tepovací stroj a ušetrite až 70% oproti profesionálnym službám.
                </p>
            </div>
            
            <!-- Navigation -->
            <div>
                <h4 class="footer-title">Navigácia</h4>
                <ul class="footer-links">
                    <li><a href="#vyhody" class="footer-link">Výhody</a></li>
                    <li><a href="#postup" class="footer-link">Ako to funguje</a></li>
                    <li><a href="#galeria" class="footer-link">Galéria</a></li>
                    <li><a href="#cennik" class="footer-link">Cenník</a></li>
                    <li><a href="#recenzie" class="footer-link">Recenzie</a></li>
                    <li><a href="#faq" class="footer-link">FAQ</a></li>
                </ul>
            </div>
            
            <!-- Contact -->
            <div>
                <h4 class="footer-title">Kontakt</h4>
                <div class="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <a href="tel:<?php echo esc_attr(tepovac_get_option('tepovac_phone', '+421 903 123 456')); ?>">
                        <?php echo esc_html(tepovac_get_option('tepovac_phone', '+421 903 123 456')); ?>
                    </a>
                </div>
                <div class="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <a href="mailto:<?php echo esc_attr(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?>">
                        <?php echo esc_html(tepovac_get_option('tepovac_email', 'info@tepovac.sk')); ?>
                    </a>
                </div>
                <div class="footer-contact-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span><?php echo esc_html(tepovac_get_option('tepovac_address', 'Námestie Hraničiarov 35, Bratislava - Petržalka')); ?></span>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p class="footer-copyright">
                &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Všetky práva vyhradené.
            </p>
            <div class="footer-legal">
                <a href="<?php echo home_url('/ochrana-osobnych-udajov'); ?>">Ochrana osobných údajov</a>
                <a href="<?php echo home_url('/obchodne-podmienky'); ?>">Obchodné podmienky</a>
            </div>
        </div>
    </div>
</footer>

<!-- WhatsApp Button -->
<?php 
$whatsapp_number = tepovac_get_option('tepovac_whatsapp', '421903123456');
$whatsapp_message = urlencode('Dobrý deň, mám záujem o prenájom tepovacieho stroja.');
?>
<a href="https://wa.me/<?php echo esc_attr($whatsapp_number); ?>?text=<?php echo $whatsapp_message; ?>" 
   target="_blank" 
   rel="noopener noreferrer" 
   class="whatsapp-btn"
   aria-label="Kontaktujte nás cez WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
