if ((typeof Shopify) === 'undefined') {
	var Shopify = {};
}

Shopify.updateMessage = function(body, header) {
  vex.dialog.alert(body);
};

Shopify.updateCartInfo = function(cart, cart_summary_id, cart_count_id) {
	if ((typeof cart_summary_id) === 'string') {
		var cart_summary = jQuery('#' + cart_summary_id);
		if (cart_summary.length) {
			// Start from scratch.
			cart_summary.empty();
			// Pull it all out.
			jQuery.each(cart, function(key, value) {
				if (key === 'items') {
					jQuery('<dt>line items</dt><dd class="items"><ul class="items"></ul></dd>').appendTo(cart_summary);
					var ul = jQuery('#' + cart_summary_id + ' dd.items ul');
					if (value.length) {
						jQuery.each(value, function(i, item) {						
							jQuery('<li>' + item.quantity + ' x ' + item.title + '</li>').appendTo(ul);
						});
					}
					else {
						jQuery('<li><em>The cart is empty.</em></li>').appendTo(ul);
					}
				}
                else if (key === 'attributes') {
                  if (jQuery.isEmptyObject(value)) {
                    jQuery('<dt>attributes</dt><dd>{ }</dd>').appendTo(cart_summary);
                  }
                  else {
                  jQuery('<dt>attributes</dt><dd class="attributes"><ul class="items"></ul></dd>').appendTo(cart_summary);
					var ul = jQuery('#' + cart_summary_id + ' dd.attributes ul');
					
						jQuery.each(value, function(k, val) {						
                          jQuery('<li>' + k + ' : ' + val + '</li>').appendTo(ul);
						});
					
					} 
                }
				else {
					jQuery('<dt>' + key + '</dt><dd>' + value + '</dd>').appendTo(cart_summary);
				}
			});
		}
	}
	// Update cart count.
	if ((typeof cart_count_id) === 'string') {
		if (cart.item_count == 0) { 
			jQuery('#' + cart_count_id).html('your cart is empty'); 
		}
		else if (cart.item_count == 1) {
			jQuery('#' + cart_count_id).html('1 item in your cart');
		}
		else {
			jQuery('#' + cart_count_id).html(cart.item_count + ' items in your cart');
		}
	} 
};

Shopify.updateProductInfo = function(product, product_summary_id) {
	if ((typeof product_summary_id) === 'string') {
		var product_summary = jQuery('#' + product_summary_id);
		if (product_summary.length) {
			// Start from scratch.
			product_summary.empty();
			// Pull it all out.
			jQuery.each(product, function(key, value) {
				if (key === 'variants') {
					jQuery('<dt>Variants</dt><dd class="items"><ul class="variants"></ul></dd>').appendTo(product_summary);
					var ul = jQuery('#' + product_summary_id + ' ul.variants');
					if (value.length) {
						jQuery.each(value, function(i, item) {						
							jQuery('<li>' + item.title + ' (sku: ' + item.sku + ') <small>' + item.inventory_quantity + ' in stock</small></li>').appendTo(ul);
						});
					}
					else {
						jQuery('<li>This product has no variant.</li>').appendTo(ul);
					}
				}
				else if (key === 'options') {
					jQuery('<dt>Options</dt><dd class="items"><ul class="options"></ul></dd>').appendTo(product_summary);
					var ul = jQuery('#' + product_summary_id + ' ul.options');
					if (value.length) {
						jQuery.each(value, function(i, item) {						
							jQuery('<li>' + item.name + '</li>').appendTo(ul);
						});
					}
					else {
						jQuery('<li>This product has no options.</li>').appendTo(ul);
					}
				}
				else {
					jQuery('<dt>' + key + '</dt><dd>' + value + '</dd>').appendTo(product_summary);
				}
			});
		}
	}
};

jQuery(function() {
	
	// Let's get the cart and show what's in it in the cart box.	
	Shopify.getCart(function(cart) {
		Shopify.updateCartInfo(cart, 'cart-info');		
	});

	// Copy variant id and handle to form fields.
	jQuery('a.copy').click(function(e) {
		e.preventDefault();
		var values = jQuery(this).attr('id').split('_');
		jQuery('.update').val(values.pop());
		jQuery('.update-handle').val(values.pop());
	});
  
    jQuery('#get-product').trigger('click');
	
	// Add another key/value pair attribute.
	jQuery('.add-attribute').click(function(){
	  jQuery(this).parent().clone(true).appendTo('.attributes').prev().append(',').find('.button').remove();
	  return false;
	});

});

Shopify.onError = function(XMLHttpRequest, textStatus) {
	// Shopify returns a description of the error in XMLHttpRequest.responseText.
	// It is JSON.
	var data = eval('(' + XMLHttpRequest.responseText + ')');
	Shopify.updateMessage(data.description, data.message + ' (' + data.status	 + ')');
};
		
Shopify.onItemAdded = function(line_item) {	 
	Shopify.updateMessage('We now have ' + line_item.quantity + ' ' + line_item.title + ' in the cart.', 'Message from the Cart');
	Shopify.getCart();
};
		
Shopify.onCartUpdate = function(cart) {
	Shopify.updateCartInfo(cart, 'cart-info', 'shopping-cart');
};

Shopify.onProduct = function(product) {
	Shopify.updateProductInfo(product, 'product-info');
};

	
