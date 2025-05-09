// Dark/light mode toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Function to set the theme
  const setTheme = (mode) => {
    if (mode === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Check for saved theme preference or use the system preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // If no saved preference, use the system preference
    setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
  }
  
  // Handle toggle button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
  
  // Listen for system preference changes
  prefersDarkScheme.addEventListener('change', (e) => {
    // Only update theme automatically if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Handle mobile navigation if needed for smaller screens
  const setupMobileNav = () => {
    // This can be expanded upon if you need a mobile menu toggle
    // For now, your navigation is simple enough that it can be responsive with CSS
  };
  
  setupMobileNav();
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return; // Skip if it's just "#"
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
