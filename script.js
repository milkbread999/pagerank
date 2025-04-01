class Webpage {
    constructor(name) {
      this.name = name;
      this.links = [];
      this.backlinks = [];
      this.fixed_pagerank = -1;
    }
  
    addLink(target) {
      if (!this.links.includes(target)) {
        this.links.push(target);
        target.addBackLink(this);
      }
    }
  
    addBackLink(source) {
      if (!this.backlinks.includes(source)) {
        this.backlinks.push(source);
      }
    }
  
    toString() {
      return this.name;
    }
  }
  
  class PageRank {
    constructor(pages, damping_factor = 0.85) {
      this.pages = pages;
      this.damping_factor = damping_factor;
      this.page_rank_table = {};
      this.initialize();
    }
  
    initialize() {
      const n = this.pages.length;
      this.pages.forEach(page => {
        this.page_rank_table[page.name] = 1 / n;
      });
    }
  
    run(iterations = 10) {
      for (let i = 0; i < iterations; i++) {
        const new_table = {};
        for (let page of this.pages) {
          if (page.fixed_pagerank !== -1) {
            new_table[page.name] = page.fixed_pagerank;
            continue;
          }
  
          let new_rank = 0;
          for (let backlink of page.backlinks) {
            new_rank += this.page_rank_table[backlink.name] / backlink.links.length;
          }
  
          new_table[page.name] = (1 - this.damping_factor) + this.damping_factor * new_rank;
        }
        this.page_rank_table = new_table;
      }
    }
  
    getRank(pageName) {
      return this.page_rank_table[pageName] || 0;
    }
  }
  
  const pages = {};
  
  function addPage() {
    const name = document.getElementById("pageName").value.trim();
    if (!name || pages[name]) return;
  
    const page = new Webpage(name);
    pages[name] = page;
  
    const totalPages = Object.keys(pages).length;
    const initialPR = (1 / totalPages).toFixed(3);
  
    // Create and append the new page's visual representation
    const div = document.createElement("div");
    div.className = "page";
    div.id = `page-${name}`;
    div.innerHTML = `<h3>${name}</h3><small>PR: ${initialPR}</small>`;
    document.getElementById("mindmap").appendChild(div);
  
    // Update all existing pages' displayed initial PR
    for (let existingName in pages) {
      const existingDiv = document.getElementById(`page-${existingName}`);
      if (existingDiv) {
        existingDiv.querySelector("small").textContent = `PR: ${(1 / totalPages).toFixed(3)}`;
      }
    }
  
    document.getElementById("pageName").value = '';
  }
  
  function addLink() {
    const from = document.getElementById("fromPage").value.trim();
    const to = document.getElementById("toPage").value.trim();
    if (!pages[from] || !pages[to] || from === to) return;
  
    pages[from].addLink(pages[to]);
  
    document.getElementById("fromPage").value = '';
    document.getElementById("toPage").value = '';
  }
  
  function runPageRank() {
    const allPages = Object.values(pages);
    const pr = new PageRank(allPages);
    pr.run();
  
    for (let name in pages) {
      const rank = pr.getRank(name).toFixed(3);
      const div = document.getElementById(`page-${name}`);
      if (div) {
        div.querySelector("small").textContent = `PR: ${rank}`;
      }
    }
  }
  