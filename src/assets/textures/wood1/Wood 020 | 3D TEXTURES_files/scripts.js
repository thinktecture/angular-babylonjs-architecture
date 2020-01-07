// Switches out the main site nav.menu with a select box
// Minimizes nav.menu on mobile devices

( function( $ ) {

    //Load these functions when the DOM is ready
	function modifyTemplate() {
        // Menu interactions
        $( '.menu li:has(ul)' ).addClass( 'parent' ).append( '<span><b class="caret"></b></span>' );
        $( '.menu span' ).click(function() {
            $(this).prev( '.sub-menu' ).toggleClass( 'show' );
        });
        $( '.menu ul:has(".current-menu-item")' ).addClass( 'show' );
    }

    //Load these functions when the DOM is ready and after IS fires
    function modifyPosts() {

        // put margin 0 in last grid
        $( '.vertical article.portfolio:nth-child(3n)' ).addClass( 'last' );
        $( '.horizontal article.portfolio:nth-child(2n), .square article.portfolio:nth-child(2n)' ).addClass( 'last' );
        $( '.vertical .portfolio:nth-child(3n+1), .horizontal .portfolio:nth-child(2n+1), .square .portfolio:nth-child(2n+1)' ).addClass( 'first' );
        
        
        // Zebra stripes for tables
        $( ".half:nth-child(2n+2)" ).addClass( "end" );
        $( ".third:nth-child(3n+3)" ).addClass( "end" );
        $( "td:odd" ).addClass( "odd" );

        // Opacity Effects
        var $SingleItem = $( '.post-format-content' );
        $SingleItem.hover(function(){
            $(this).find( '.img-entry' ).stop(true, true).animate({opacity: 0.6},200);
        }, function(){
            $(this).find( '.img-entry' ).stop(true, true).animate({opacity: 1},200);

        });
        
        // View mode
        // Checks cookie, sets proper display
        if ( $.cookie( 'mode' ) == 'list' ) {
            list_update();
        } else if ( $.cookie( 'mode' ) == 'grid' ) {
            grid_update();
        } else {
        	// set gridspace_layout from theme options
        	if( gridspace_layout == 'grid' ) {
        		grid_update();
        	} else {
        		list_update();
        	}
        }

        // updates cookie on click
        $( '#show_list' ).click(function(){
            if ( $(this).hasClass( 'active' ) ) {
                return false;
            }
            $.cookie( 'mode' , null );
            $.cookie( 'mode', 'list', { expires: 7, path: '/' } );
            list();
        });

        // updates cookie on click
        $('#show_grid').click(function(){
            if ( $(this).hasClass( 'active' ) ) {
                return false;
            }
            $.cookie( 'mode' , null );
            $.cookie( 'mode', 'grid', { expires: 7, path: '/' } );
            grid();
        });

        function list(){
            $( '#show_grid' ).removeClass( 'active' );
            $( '#show_list' ).addClass( 'active' );
            $( '.portfolios' )
                .fadeOut( 'fast', function(){
                    list_update();
                    $(this).fadeIn( 'fast' );
                })
            ;
        }

        function grid(){
            $( '#show_list' ).removeClass( 'active' );
            $( '#show_grid' ).addClass( 'active' );
            $( '.portfolios' )
                .fadeOut( 'fast', function(){
                    grid_update();
                    $(this).fadeIn( 'fast' );
                })
            ;
        }

        function list_update(){
            $( '#show_list' ).addClass( 'active' );
            $( '.portfolios' ).addClass( 'list' ).removeClass( 'grid' ).fadeIn();
            $( '.portfolio' ).css( {'width': '100%'} );
            $( '.list .entry-content' ).unbind( 'mouseenter mouseleave' );
            $( '.hide, .entry-summary, .entry-meta' ).show();
            $.cookie( 'mode', 'list', { expires: 7, path: '/' } );
        }

        function grid_update(){
            $( '#show_grid' ).addClass( 'active' );
            $( '.portfolios' ).addClass( 'grid' ).removeClass( 'list' ).fadeIn();
            $( '.portfolio' ).css( { 'width': '48%' } );
            $( '.vertical .portfolio' ).css( { 'width': '31%' } );
            $( '.portfolios .entry-summary, .hide, .portfolios .entry-meta' ).hide();
            $( '.portfolios .entry-content' ).hover(function(){
                $(this).find( '.hide, .entry-meta' ).show();
                $(this).find( 'img' ).stop( true, true ).fadeTo( 200, 0.2 );
            },function(){
                $(this).find( '.hide, .entry-meta' ).hide();
                $(this).find( 'img' ).stop( true, true ).fadeTo( 200, 1.0 );
            });
            $.cookie( 'mode', 'grid', { expires: 7, path: '/' } );
        }
    }
    
    $( document )
    	.ready( modifyPosts )
    	.ready ( modifyTemplate )
    	.on( 'post-load', modifyPosts );
    	
} ) (jQuery)