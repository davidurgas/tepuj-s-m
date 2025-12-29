<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Prenájom profesionálnych tepovacích strojov v Bratislave. Ušetrite až 70% oproti profesionálnemu tepovaniu. Od 20€ na 4 hodiny.">
    <meta name="keywords" content="prenájom tepovača, tepovanie, čistenie kobercov, Bratislava, profesionálny tepovač">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Navigation -->
<nav class="nav transparent" id="main-nav">
    <div class="container nav-container">
        <a href="<?php echo home_url(); ?>" class="nav-logo">
            <?php if (has_custom_logo()): ?>
                <?php the_custom_logo(); ?>
            <?php else: ?>
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/logo.png" alt="<?php bloginfo('name'); ?>">
            <?php endif; ?>
        </a>
        
        <ul class="nav-menu" id="nav-menu">
            <li><a href="#vyhody" class="nav-link">Výhody</a></li>
            <li><a href="#postup" class="nav-link">Ako to funguje</a></li>
            <li><a href="#galeria" class="nav-link">Galéria</a></li>
            <li><a href="#cennik" class="nav-link">Cenník</a></li>
            <li><a href="#recenzie" class="nav-link">Recenzie</a></li>
            <li><a href="#faq" class="nav-link">FAQ</a></li>
            <li><a href="#cennik" class="btn btn-primary">Rezervovať</a></li>
        </ul>
        
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>
