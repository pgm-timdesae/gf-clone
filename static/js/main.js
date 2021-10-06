const DATA_EVENTS_API = 'https://www.pgm.gent/data/gentsefeesten/events_500.json';
const DATA_CATEGORY_API = 'https://www.pgm.gent/data/gentsefeesten/categories.json';

(() => {
  const app = {
    initialize:function () {
      console.log('1. Application started!');
      this.cacheElements();
      this.buildUI();
    },

    cacheElements: function () {
      console.log('2. Cache elements');
      this.$menuIcon = document.querySelector('.hamburger-btn')
      this.$menu = document.querySelector('.menu')
      this.$closeIcon = document.querySelector('.close-icon');
      this.$clickSubmenu = document.querySelector('.menu__submenu');
      this.$submenu = document.querySelector('.submenu');
      this.$overviewContainer = document.querySelector('.overview__list');
      this.$container = document.querySelector('.container');
      this.$exampleList = document.querySelector('.examples__list');
      this.$detailContainer = document.querySelector('.detail-container');
      this.$backToTopBtn = document.querySelector('.backToTopBtn');
      console.log(this.$backToTopBtn);
    },

    buildUI: function () {
      console.log('3. Build user interface');
      this.generateClickEventMenu();
      this.generateCloseIcon();  
      this.generateSubmenu();
      this.getDataFromCategoryAPI();
    },

    generateClickEventMenu: function (){
      console.log('4. create a click event on icon');
      this.$menuIcon.addEventListener('click', (event) => {
        if(this.$menu.classList.contains('open')){
          this.$menu.classList.remove('open')
        } else {
          this.$menu.classList.add('open');
        }
      });
    },

    generateCloseIcon: function(){
      this.$closeIcon.addEventListener('click', (event) => {
        if(this.$menu.classList.contains('open')){
          this.$menu.classList.remove('open')
        } else {
          this.$menu.classList.add('open');
        }
      });
    },

    generateSubmenu: function(){
      this.$clickSubmenu.addEventListener('click', (event) => {
        if(this.$submenu.classList.contains('open')){
          this.$submenu.classList.remove('open')
        } else {
          this.$submenu.classList.add('open');
        }
      });
    },

    getDataFromCategoryAPI(){
      fetch(DATA_CATEGORY_API)
        .then((response) => response.json())
        .then((json) => {
          this.categories = json;
          this.getDataFromEventAPI(json)
        })
        .catch((err) => console.log(err));
    },

    getDataFromEventAPI(){
      fetch(DATA_EVENTS_API)
        .then((response) => response.json())
        .then((json) => {
          this.events = json
          this.insertHTML();
          this.generateHTMLForThreeExamples();
          this.generateHTMLForOverviewCategories();
        })
        .catch((err) => console.log(err));
    },

    insertHTML() {            
      let selectedDay = this.generatePageForDay();

       if (selectedDay !== null){
        this.events = this.events.filter((event) => event.day === selectedDay);
      }

      this.generateDetailPageForEvent();
 
      const html = this.categories.map((category) => {
        const filteredEvents = this.events.filter((event) => {
          return event.category.indexOf(category) > -1;
        });

        filteredEvents.sort((event1, event2) => {
          return event1.sort_key.localeCompare(event2.sort_key);
        });

        const listItems = filteredEvents.map((event) => {
          return `
          <li>
            <a class="overflow-events" href="detail.html?day=${event.day}&slug=${event.slug}">
              <div class="card-image" style="background-image: url('${event.image !== null ? event.image.thumb : 'static/media/images/article-1.png'}');"></div>
              <div class="card-text">
                <span class="card__date">${event.start} u.</span>
                <h3 class="card__title"> ${event.title}</h3>
                <span class="card__place"> ${event.location}</span>
              </div>
            </a>
          </li>
          `
        }).join('');


        return `
        <section id="${category}">
          <div class="section-title">
            <h2>${category}</h2>
            <a href="#overview">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13.682 11.791l-6.617 6.296L4 15.171 15.74 4 28 15.665l-2.935 2.793-7.113-6.768v16.311h-4.269z"/></svg>
            </a>
          </div>
          <ul class="card-list">
            ${listItems}
          </ul>
        </section>
        `
      }).join('');

      this.$container.innerHTML = html;
    },

     generateHTMLForThreeExamples(){
      const three = this.events.slice(0, 3)
    
      const examples = three.map((event) => {
        return `
        <li>
          <a class="overflow-events" href="detail.html?day=${event.day}&slug=${event.slug}">
            <div class="card-image" style="background-image: url('${event.image !== null ? event.image.thumb : 'static/media/images/gf-19.svg'}');"></div>
            <div class="card-text">
              <span class="card__date">${event.start} u.</span>
              <h3 class="card__title"> ${event.title}</h3>
              <span class="card__place"> ${event.location}</span>
            </div>
          </a>
        </li>
        `
      }).join('');
      this.$exampleList.innerHTML = examples;
    },
     
    generateHTMLForOverviewCategories(){
      const overview = this.categories.map((category) => {
        return `
        <li>
          <a class="overview__link" id="overview" href="#${category}">${category}</a>
        </li>`
      }).join('');
      this.$overviewContainer.innerHTML = overview;
    },

    generatePageForDay: function() {
      const search = window.location.search;
      const params = new URLSearchParams(search);

      const urlType = params.get('day');

       if (urlType !== null) {
         return params.get('day');
      }  else {
        return null;
      }      
    },

    generateDetailPageForEvent() {
      const search = window.location.search;
      console.log(search);
      const params = new URLSearchParams(search);

      const urlType = params.get('slug');
      console.log(urlType);

      console.log(this.events)

      if (urlType !== null) {
        this.events = this.events.filter((event) => event.slug === urlType);

        const detailEvent = this.events.map((event) => {
          return `
          <div class="detail-top">
            <div class="detail-title">
              <h2>${event.title}</h2>
              <div class="detail-title__place">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16.5 10.568a4 4 0 000 8 4 4 0 000-8m0 3c.551 0 1 .45 1 1s-.449 1-1 1-1-.449-1-1c0-.55.449-1 1-1M16.5 3C10.149 3 5 8.15 5 14.5c0 8.363 11.5 14.636 11.5 14.636S28 22.863 28 14.5C28 8.15 22.851 3 16.5 3m0 3c4.687 0 8.5 3.813 8.5 8.5 0 4.592-5.253 9.003-8.5 11.131-3.249-2.13-8.5-6.54-8.5-11.13C8 9.812 11.813 6 16.5 6"/></svg>
                <span>${event.location}</span>
              </div>
              <h3 class="detail-title__time">${event.day_of_week} ${event.day} Juli - ${event.start} > ${event.end}</h3>
              <div class="detail-description">
                <p>${event.description}</p>
              </div>
            </div>
            <div class="detail-media">
              <img src="${event.image !== null ? event.image.full : 'static/media/images/gf-19.svg'}">
            </div>
          </div>
          
          <div class="detail-details">
            <div class="detail-details__website">
              <span class="detail-details__label">Website:</span>
              <span class="detail-details__item">${event.url !== null ? event.url : 'geen website gevonden'}</span>
            </div>
            <div class="detail-details__organizer">
              <span class="detail-details__label">Organisator:</span>
              <span class="detail-details__item">${event.organizer}</span>
            </div>
            <div class="detail-details__category">
              <span class="detail-details__label">Categorieën:</span>
              <span class="detail-details__item">${event.category}</span>
            </div>
            <div class="detail-details__wheelchair">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12.646 15.008l.47 2.993-.115-.001a4.5 4.5 0 104.071 2.58l.012.027 3.332.766a7.5 7.5 0 11-10.781-5.579l.043-.02-.813-2.274H7a1 1 0 010-2h2.57c.431.001.798.274.938.656l.002.007 1.064 2.972c.35-.067.707-.11 1.072-.127zm.496-6.526a3.5 3.5 0 111.985-.382l-.019.009.722 4.606c.087-.015.177-.018.269-.01l6 .597a1 1 0 11-.203 1.989h.005l-5.757-.572.338 2.157 6.392 1.468c.375.088.665.379.751.747l.001.007 1.855 8.182 2.277-.567a1 1 0 01.491 1.939l-.007.002-3.268.815a1 1 0 01-1.216-.742l-.001-.007-1.943-8.566-6.439-1.48a1.002 1.002 0 01-.763-.813l-.001-.006-1.47-9.374zM13.5 6.5a1.5 1.5 0 000-3 1.5 1.5 0 000 3zm-.5 18a2 2 0 110-4 2 2 0 110 4z"/></svg>            
            </div>
            <div class="detail-details__socials">
              <ul class="detail-socials">
                <li>
                  <a href="https://twitter.com/GFGent">
                    <div class="detail-social__link">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12.973 24c7.17 0 11.093-5.77 11.093-10.773 0-.164-.003-.328-.013-.49a7.865 7.865 0 001.93-1.935l.017-.025a7.759 7.759 0 01-2.202.591l-.038.004a3.842 3.842 0 001.706-2.068l.008-.027a7.785 7.785 0 01-2.427.912l-.05.008c-1.473-1.526-3.942-1.603-5.512-.172a3.733 3.733 0 00-1.232 2.761v.001c0 .29.035.58.103.863-3.134-.153-6.055-1.59-8.036-3.956-1.032 1.73-.504 3.942 1.208 5.054a3.947 3.947 0 01-1.787-.483l.021.01v.048c0 1.802 1.307 3.355 3.125 3.712a3.915 3.915 0 01-1.027.133 4.11 4.11 0 01-.758-.071l.025.004c.512 1.541 1.975 2.598 3.642 2.63a7.907 7.907 0 01-4.814 1.62h-.027.001c-.31 0-.62-.017-.929-.053A11.147 11.147 0 0012.953 24h.022-.001"/></svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/gentsefeesten">
                    <div class="detail-social__link">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M17.49 25v-8.21h2.95l.44-3.2h-3.39v-2.043c0-.927.276-1.558 1.697-1.558L21 9.988V7.126A25.196 25.196 0 0018.445 7h-.091.005c-2.614 0-4.403 1.491-4.403 4.23v2.36H11v3.2h2.956V25h3.535z"/></svg>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="https://www.flickr.com/photos/stadgent">
                    <div class="detail-social__link">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M8.625 13.486c0 1.396.614 3.464 2.234 3.911.057 0 .112.057.224.057.392 0 .615-1.006.615-1.286 0-.335-.895-1.062-.895-2.402 0-2.906 2.347-4.917 5.42-4.917 2.627 0 4.582 1.397 4.582 3.911 0 1.9-.838 5.475-3.464 5.475-.95 0-1.788-.67-1.788-1.563 0-1.341 1.006-2.682 1.006-4.079 0-.838-.503-1.564-1.509-1.564-1.341 0-2.124 1.396-2.124 2.458 0 .614.057 1.285.392 1.844-.559 2.124-1.62 5.308-1.62 7.487 0 .671.111 1.341.167 2.012v.112l.168-.056c1.956-2.459 1.844-2.962 2.738-6.203.447.838 1.676 1.285 2.682 1.285 4.079 0 5.923-3.688 5.923-7.04 0-3.52-3.297-5.867-6.929-5.867-3.911-.001-7.822 2.458-7.822 6.425z"/></svg>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          `
        });
        this.$detailContainer.innerHTML = detailEvent;
      }  
    },
  };
  app.initialize();

})();