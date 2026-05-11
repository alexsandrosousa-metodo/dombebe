
if (!customElements.get('product-compare-button')) {
  {
  "handle": "{{ product.handle | escape }}",
  "available": {{ product.available | json }},
  "variants": [
    {%- for variant in product.variants -%}
      {
        "id": {{ variant.id | json }},
        "featured_image": {% unless variant.featured_media.id == blank %}{{ variant.featured_media.id }}{% else %}null{% endunless %},
        ...
      }
    {% if forloop.last == false %},{% endif -%}
    {%- endfor -%}
  ]
}
  customElements.define('product-compare-button', class ProductCompareButton extends HTMLElement {
    constructor() {
      super();
      
      this.anchor = this.querySelector('a') ? this.querySelector('a') : this.querySelector('button');
      this.anchor.addEventListener('click', this.onCompare.bind(this));
    }
    
    connectedCallback(){
      this.checkComparelistStatus();
    }
    
    onCompare(){
      event.preventDefault();
      if(!this.dataset.handle) return;
      
      const handle = this.dataset.handle;
      const compareListStorage = localStorage.getItem('comparelist');
      const comparelistContainer = document.querySelector('[data-modal-main="compare"]');
      const comparelistOrganizer = document.querySelector('.compare-counter');
      let compareList = compareListStorage ? JSON.parse(compareListStorage) : [];
      const compareLimit = 3;
      
      if(!compareList.includes(handle)){
      
        if(compareList.length && compareList.length >= compareLimit){
          comparelistContainer.classList.add('--limit-exceed');
          
          alert(window.additionalStrings.compare.limitExceed);
          return;
        
        } else{
          compareList.push(handle);
          comparelistContainer.classList.remove('--limit-exceed');
        }
      
      } else{
        var index = compareList.indexOf(handle);
        
        if (index !== -1) {
          compareList.splice(index, 1);
        }
      }
      localStorage.setItem('comparelist', JSON.stringify(compareList));
      
      const modalOpener = document.querySelector('[data-modal-main="compare"]');

      if(compareList.length === 0){
        modalOpener.classList.add('hidden');
      
      } else if(compareList.length === 1){
        modalOpener.classList.remove('hidden');
        modalOpener.classList.add('--disabled');
      
      } else{
        modalOpener.classList.remove('--disabled');
        modalOpener.classList.remove('hidden');
      }
      
      if(comparelistOrganizer){
        comparelistOrganizer.innerText = compareList.length;
      }
      
      this.checkComparelistStatus();
    }
    
    checkComparelistStatus(){
      if(!this.dataset.handle) return;
      
      const allBtns = document.querySelectorAll('product-compare-button');
      const compareListStorage = localStorage.getItem('comparelist');
      const compareList = compareListStorage ? JSON.parse(compareListStorage) : [];
      
      allBtns.forEach(btn => {
        const handle = btn.dataset.handle;
        const anchor = btn.querySelector('a');
        const text = btn.querySelector('.pwb-text');
        
        if(compareList.includes(handle)){
          anchor.classList.add('--compare-active');
          text.innerHTML = window.accessibilityStrings.compareRemovebutton.replace('[product_name]', btn.dataset.product);
        
        } else{
          anchor.classList.remove('--compare-active');
          text.innerHTML = window.accessibilityStrings.compareAddbutton.replace('[product_name]', btn.dataset.product);
        }
      });
    }
    
  });
}
