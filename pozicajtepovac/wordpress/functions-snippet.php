<?php
/**
 * VOLITEĽNÉ: obsah vlož do functions.php aktívnej témy.
 *
 * Šablóna page-pozicajtepovac.php si assety zaraďuje sama, takže tento súbor
 * NIE JE nutný. Použi ho, ak chceš mať enqueue + optimalizácie na jednom mieste
 * (napr. lazy loading, odloženie JS, čistenie <head>).
 *
 * @package Pozicajtepovac
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Natívne lazy loading pre všetky obrázky v obsahu (WP to robí od 5.5 automaticky,
 * tu je poistka + fetchpriority pre hero).
 */
add_filter( 'wp_get_attachment_image_attributes', function ( $attr ) {
	if ( empty( $attr['loading'] ) ) {
		$attr['loading'] = 'lazy';
	}
	$attr['decoding'] = 'async';
	return $attr;
} );

/**
 * Odloženie vlastného JS (defer) pre lepší PageSpeed.
 */
add_filter( 'script_loader_tag', function ( $tag, $handle ) {
	if ( 'pt-script' === $handle && false === strpos( $tag, 'defer' ) ) {
		$tag = str_replace( ' src', ' defer src', $tag );
	}
	return $tag;
}, 10, 2 );

/**
 * Preconnect pre Google Fonts (rýchlejšie načítanie písma).
 */
add_filter( 'wp_resource_hints', function ( $hints, $relation ) {
	if ( 'preconnect' === $relation ) {
		$hints[] = 'https://fonts.gstatic.com';
	}
	return $hints;
}, 10, 2 );
