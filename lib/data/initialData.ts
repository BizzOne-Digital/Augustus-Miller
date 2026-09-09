import { ServiceItem, TeamMember, Testimonial, FAQItem, BlogPost, Product, SiteSettings } from '../types';

export const initialServices: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Financial & Small Business Consultancy',
    slug: 'financial-consulting',
    shortDescription: 'We empower entrepreneurs, startups, and established businesses with business planning, budgeting, financial management, tax preparation, investment guidance, and strategic planning.',
    description: 'Miller Group of Company LLC provides professional financial and small business consultancy services designed to empower entrepreneurs, startups, and established organizations to achieve sustainable growth and financial stability. We help clients identify opportunities, reduce risks, improve profitability, and develop practical long-term strategies. Our goal is to help businesses make informed decisions that strengthen profitability and long-term growth.',
    divisionSlogan: 'Smart Advice. Stronger Business.',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    iconName: 'TrendingUp',
    accentColor: '#C8973E',
    includedServices: [
      'Business planning',
      'Budgeting & financial management',
      'Tax preparation (individual & business)',
      'Investment guidance',
      'Business registration support',
      'Cash flow analysis',
      'Strategic planning',
      'Operational improvement'
    ],
    benefits: [
      'Clear, data-driven financial roadmaps tailored to your industry',
      'Proactive identification of cost savings and revenue leaks',
      'Objective guidance for key capital and operational decisions',
      'Tailored solutions for sole proprietors, LLCs, and growing enterprises'
    ],
    process: [
      { step: 1, title: 'Discovery & Consultation', description: 'We review your business structure, cash flow, financial history, and core objectives.' },
      { step: 2, title: 'Analysis & Opportunity Audit', description: 'We identify bottlenecks, operational friction, and profit acceleration pathways.' },
      { step: 3, title: 'Strategic Roadmap', description: 'We deliver an actionable, milestone-driven business and financial plan.' },
      { step: 4, title: 'Implementation & Review', description: 'Periodic review sessions to monitor milestones and pivot as market conditions evolve.' }
    ],
    faq: [
      { question: 'Who can benefit from your business consulting?', answer: 'We work with solo entrepreneurs, small-to-medium business owners, and organizations seeking structured financial clarity and operational improvement.' },
      { question: 'How do consultation sessions take place?', answer: 'We offer flexible in-person consultations throughout Metro Atlanta and statewide Georgia, as well as secure virtual sessions nationwide.' }
    ],
    featured: true,
    active: true,
    displayOrder: 1,
    seoTitle: 'Financial & Small Business Consultancy | Miller Group of Company LLC',
    seoDescription: 'Professional financial consulting, strategic planning, budgeting, and business advisory services in Georgia.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-2',
    name: 'Property Rental & Management Services',
    slug: 'property-management',
    shortDescription: 'We provide professional rental and property management solutions including tenant placement, lease management, inspections, and maintenance coordination.',
    description: 'Our property management division provides peace of mind for real estate owners, landlords, and investors. From rigorous tenant placement and seamless rent collection to regular inspections and 24/7 maintenance coordination, we preserve and elevate property values across Georgia. We ensure properties are safe, comfortable, and well-maintained.',
    divisionSlogan: 'Quality Properties. Trusted Service.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Building',
    accentColor: '#0A2540',
    includedServices: [
      'Tenant placement & screening',
      'Lease management',
      'Property inspections',
      'Maintenance coordination',
      'Rental administration',
      'Owner & tenant support'
    ],
    benefits: [
      'Minimized vacancy rates through targeted marketing',
      'Thorough credit, background, and employment verification',
      'Transparent monthly statements and owner portal updates',
      'Proactive upkeep ensuring long-term property appreciation'
    ],
    process: [
      { step: 1, title: 'Property Assessment', description: 'We inspect the property, recommend value-add improvements, and benchmark fair market rent.' },
      { step: 2, title: 'Marketing & Tenant Screening', description: 'High-visibility listing followed by multi-point vetting of tenant candidates.' },
      { step: 3, title: 'Lease Execution', description: 'Legally compliant lease signing, security deposit escrow, and documented walkthrough.' },
      { step: 4, title: 'Ongoing Management', description: 'Reliable rent collection, periodic maintenance, and transparent financial reporting.' }
    ],
    faq: [
      { question: 'What property types do you manage?', answer: 'We manage single-family residential homes, multi-family units, townhouses, and select light commercial properties throughout Georgia.' },
      { question: 'How do you handle maintenance emergencies?', answer: 'Our dedicated repair network is accessible 24/7 to resolve urgent plumbing, HVAC, or security issues immediately.' }
    ],
    featured: true,
    active: true,
    displayOrder: 2,
    seoTitle: 'Property Rental & Management Services | Miller Group of Company LLC',
    seoDescription: 'Reliable residential and commercial property management, tenant placement, and asset care in Metro Atlanta.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-3',
    name: 'General Construction',
    slug: 'construction',
    shortDescription: 'We deliver durable, functional, and aesthetically appealing construction services for residential and commercial clients.',
    description: 'Miller Group of Company LLC delivers dependable general construction solutions built on structural integrity, meticulous craftsmanship, and strict timeline adherence. We handle everything from site preparation and new builds to major additions and tenant build-outs. Safety, quality, and timely completion are our top priorities.',
    divisionSlogan: 'Building Dreams. Creating Legacies.',
    heroImage: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=1200&auto=format&fit=crop',
    iconName: 'HardHat',
    accentColor: '#C8973E',
    includedServices: [
      'Residential & commercial construction',
      'Renovations & remodeling',
      'Structural improvements',
      'Site preparation',
      'Finishing works',
      'Infrastructure development'
    ],
    benefits: [
      'Clear written quotes agreed before work begins',
      'Safety-first job sites adhering to strict construction standards',
      'Direct communication and dedicated on-site project oversight',
      'Durable materials sourced from trusted regional suppliers'
    ],
    process: [
      { step: 1, title: 'Consultation & Site Review', description: 'We evaluate architectural drawings, site conditions, and project scope.' },
      { step: 2, title: 'Proposal & Material Planning', description: 'Detailed budget breakdown, milestone timelines, and material sourcing schedules.' },
      { step: 3, title: 'Construction Execution', description: 'Skilled tradesmen execute each phase under active supervisory oversight.' },
      { step: 4, title: 'Final Inspection & Handover', description: 'Comprehensive punch-list walkthrough with the owner before final project sign-off.' }
    ],
    faq: [
      { question: 'Do you handle commercial projects as well as residential?', answer: 'Yes, we manage residential additions, custom remodeling, as well as commercial retail and office build-outs.' },
      { question: 'How do you handle permits and local code requirements?', answer: 'We coordinate the necessary engineering submissions and local municipal permit approvals.' }
    ],
    featured: true,
    active: true,
    displayOrder: 3,
    seoTitle: 'General Construction Services | Miller Group of Company LLC',
    seoDescription: 'Premier residential and commercial general construction, remodeling, and structural additions in Georgia.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-4',
    name: 'Repairs & Maintenance Services',
    slug: 'repairs-maintenance',
    shortDescription: 'Reliable repair and maintenance for homes, offices, and industrial facilities.',
    description: 'Keep your property operating smoothly and prevent costly future breakdowns with Miller Group’s repair and maintenance services. Our experienced technicians diagnose issues swiftly and deliver enduring, code-compliant repairs.',
    divisionSlogan: 'Fixing Today. Securing Tomorrow.',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Wrench',
    accentColor: '#0A2540',
    includedServices: [
      'Plumbing & electrical repairs',
      'Carpentry & painting',
      'Roofing maintenance',
      'Drywall repair',
      'Flooring repairs',
      'Preventive maintenance',
      'Emergency repairs'
    ],
    benefits: [
      'Rapid diagnostic response for immediate property relief',
      'Clean, respectful technicians who protect your flooring and furniture',
      'Long-lasting fixes that resolve the root cause, not just symptoms',
      'Customized maintenance schedules for property managers and owners'
    ],
    process: [
      { step: 1, title: 'Service Request', description: 'Contact us with details or photos of the repair needed.' },
      { step: 2, title: 'Diagnostics & Quote', description: 'We inspect the issue on-site or provide an upfront written estimate.' },
      { step: 3, title: 'Precision Repair', description: 'Our technicians complete the repair using commercial-grade parts.' },
      { step: 4, title: 'Testing & Cleanup', description: 'We test functionality thoroughly and leave the work area clean.' }
    ],
    faq: [
      { question: 'Do you offer emergency repair services?', answer: 'Emergency repair services are available subject to technician scheduling and availability in the Metro Atlanta area.' },
      { question: 'Can I set up a recurring maintenance plan for my building?', answer: 'Yes! We offer monthly and quarterly preventative maintenance contracts for commercial properties and rental portfolios.' }
    ],
    featured: true,
    active: true,
    displayOrder: 4,
    seoTitle: 'Repairs & Maintenance Services | Miller Group of Company LLC',
    seoDescription: 'Reliable plumbing, electrical, carpentry, drywall, and facility repairs across Metro Atlanta, GA.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-5',
    name: 'Handyman Services',
    slug: 'handyman',
    shortDescription: 'Convenient and affordable everyday repair solutions.',
    description: 'No job is too small for our skilled handyman division. Whether you need drywall touched up, furniture assembled, lighting replaced, or smart home fixtures installed, our team gets it done cleanly, efficiently, and right the first time.',
    divisionSlogan: 'No Job Too Small. We Do It All.',
    heroImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Hammer',
    accentColor: '#C8973E',
    includedServices: [
      'Furniture assembly',
      'Door & window repairs',
      'Appliance installation',
      'TV mounting',
      'Gutter cleaning',
      'Pressure washing',
      'Minor electrical & plumbing',
      'General home improvement'
    ],
    benefits: [
      'Save weekends and eliminate the stress of unfinished to-do lists',
      'Fully equipped handymen equipped with modern professional tools',
      'Transparent flat-rate or hourly pricing options',
      'Reliable appointment arrival windows and courteous service'
    ],
    process: [
      { step: 1, title: 'List Your Tasks', description: 'Submit your punch-list of items through our booking tool.' },
      { step: 2, title: 'Upfront Estimate', description: 'We review your list and provide a transparent time and cost estimate.' },
      { step: 3, title: 'Efficient Completion', description: 'Our handyman arrives on time with all required tools and hardware.' },
      { step: 4, title: 'Satisfaction Sign-off', description: 'Walk through the completed punch-list together to verify complete satisfaction.' }
    ],
    faq: [
      { question: 'Can I book multiple tasks in a single visit?', answer: 'Absolutely! We encourage clients to bundle tasks so our handyman can complete your entire punch list in one visit.' },
      { question: 'Do you bring your own tools and hardware?', answer: 'Yes, our technicians arrive equipped with standard fasteners, anchors, ladders, and specialized power tools.' }
    ],
    featured: true,
    active: true,
    displayOrder: 5,
    seoTitle: 'Professional Handyman Services | Miller Group of Company LLC',
    seoDescription: 'Reliable handyman services in Metro Atlanta for TV mounting, furniture assembly, minor repairs, and home maintenance.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-6',
    name: 'Transportation Services',
    slug: 'transportation',
    shortDescription: 'Safe, professional, and dependable transport solutions.',
    description: 'Miller Group provides safe, punctual, and highly organized transportation and courier solutions across Metro Atlanta and statewide Georgia. We ensure your items, materials, or equipment arrive intact and on schedule every single time.',
    divisionSlogan: 'Safe. Reliable. On Time. Every Time.',
    heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Truck',
    accentColor: '#0A2540',
    includedServices: [
      'Local & regional delivery',
      'Courier services',
      'Moving assistance',
      'Equipment transportation',
      'Business transportation',
      'Custom logistics solutions'
    ],
    benefits: [
      'Strict punctuality and real-time transit communication',
      'Careful handling and protective cargo strapping on all loads',
      'Flexible scheduling including weekend and early morning dispatch',
      'Dedicated drivers committed to courtesy and professionalism'
    ],
    process: [
      { step: 1, title: 'Route & Cargo Details', description: 'Provide pickup/delivery locations, weight, dimensions, and timing.' },
      { step: 2, title: 'Logistics Plan & Quote', description: 'We schedule the appropriate vehicle and confirm transit windows.' },
      { step: 3, title: 'Safe Loading & Transit', description: 'Careful loading, load balancing, and secure transit.' },
      { step: 4, title: 'Delivery Verification', description: 'Recipient signature and timestamped delivery receipt.' }
    ],
    faq: [
      { question: 'What areas do you transport to and from?', answer: 'We primarily serve Metro Atlanta, surrounding counties, and statewide Georgia, with regional routes available upon request.' },
      { question: 'Do you help with loading and unloading?', answer: 'Yes, labor assistance for loading, unloading, and placement can be included based on your request.' }
    ],
    featured: true,
    active: true,
    displayOrder: 6,
    seoTitle: 'Transportation & Logistics Services | Miller Group of Company LLC',
    seoDescription: 'Reliable freight, delivery, equipment hauling, and transportation services throughout Georgia.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv-7',
    name: 'IT Services',
    slug: 'it-services',
    shortDescription: 'Modern technology solutions for today\'s digital world.',
    description: 'Power your business with dependable technology solutions from Miller Group. Our IT division delivers practical, modern digital infrastructure—from robust office networks and cybersecurity hardening to custom website development and responsive technical troubleshooting.',
    divisionSlogan: 'Smart Technology. Stronger Connections. Better Business.',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    iconName: 'Monitor',
    accentColor: '#C8973E',
    includedServices: [
      'Computer installation & maintenance',
      'Network setup & support',
      'Cybersecurity',
      'Cloud services',
      'Software installation',
      'Website design & development',
      'Database management',
      'Technical support',
      'Digital transformation consulting'
    ],
    benefits: [
      'Drastically reduced downtime with proactive monitoring',
      'Enhanced security posture safeguarding customer and business data',
      'Modern web presence optimized for local search and mobile conversions',
      'Clear, friendly technical advice without frustrating tech jargon'
    ],
    process: [
      { step: 1, title: 'Technology Audit', description: 'We evaluate your current hardware, network, software, and vulnerabilities.' },
      { step: 2, title: 'Solution Architecture', description: 'We propose scalable, budget-conscious technology upgrades.' },
      { step: 3, title: 'Seamless Deployment', description: 'Implementation scheduled during off-peak hours to minimize business disruption.' },
      { step: 4, title: 'Support & Management', description: 'Continuous monitoring, routine updates, and responsive helpdesk support.' }
    ],
    faq: [
      { question: 'Do you support small businesses with no dedicated IT staff?', answer: 'Yes! We act as your outsourced IT department, providing fast on-call support whenever you encounter tech issues.' },
      { question: 'Can you build our company website and manage our email?', answer: 'Yes, we design modern responsive websites and configure professional business email suites like Google Workspace.' }
    ],
    featured: true,
    active: true,
    displayOrder: 7,
    seoTitle: 'Business IT Services & Tech Support | Miller Group of Company LLC',
    seoDescription: 'Complete IT consulting, network infrastructure, cybersecurity, web design, and tech support in Georgia.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialTeam: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Augustus Miller',
    position: 'Founder & CEO',
    bio: 'A dedicated leader committed to delivering excellence across multiple industries. With a strong background in business, operations, and service delivery, Augustus ensures every client receives professional, reliable, and high-quality solutions.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    email: 'sgustus76@gmail.com',
    phone: '+1 (770) 572-2022',
    linkedin: 'https://linkedin.com',
    displayOrder: 1,
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const initialTestimonials: Testimonial[] = [
  // Client-supplied placeholder quotes. These are intentionally anonymous and
  // carry no invented names, companies, or avatars. Replace only with real,
  // attributable reviews the client has permission to publish.
  {
    id: 'test-1',
    customerName: 'Residential Client',
    customerRole: 'Homeowner',
    company: '',
    content: 'Professional, reliable, and fast. Miller Group handled our repairs perfectly.',
    rating: 5,
    serviceCategory: 'Repairs & Maintenance',
    active: true,
    avatarUrl: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'test-2',
    customerName: 'Small Business Owner',
    customerRole: 'Business Owner',
    company: '',
    content: 'Their business consulting helped us restructure and grow.',
    rating: 5,
    serviceCategory: 'Financial & Business Consultancy',
    active: true,
    avatarUrl: '',
    createdAt: new Date().toISOString()
  },
  {
    id: 'test-3',
    customerName: 'Commercial Client',
    customerRole: 'Commercial Property Owner',
    company: '',
    content: 'Excellent construction quality and great communication throughout the project.',
    rating: 5,
    serviceCategory: 'General Construction',
    active: true,
    avatarUrl: '',
    createdAt: new Date().toISOString()
  }
];

export const initialFAQs: FAQItem[] = [
  // Questions 1-5 are the client's brief copy, verbatim.
  {
    id: 'faq-1',
    question: 'How do I request a service?',
    answer: 'Use our contact form or call us directly to schedule a consultation.',
    category: 'General',
    displayOrder: 1,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'faq-2',
    question: 'Do you offer pricing online?',
    answer: 'Pricing varies by project. Contact us for a customized quote.',
    category: 'Pricing',
    displayOrder: 2,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'faq-3',
    question: 'What areas do you serve?',
    answer: 'We serve Metro Atlanta, surrounding counties, and statewide Georgia.',
    category: 'Service Areas',
    displayOrder: 3,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'faq-4',
    question: 'Are you licensed and insured?',
    answer: 'Yes — all services are performed by qualified and insured professionals.',
    category: 'General',
    displayOrder: 4,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'faq-5',
    question: 'Do you offer emergency repairs?',
    answer: 'Yes, emergency repair services are available depending on technician availability.',
    category: 'Repairs',
    displayOrder: 5,
    active: true,
    createdAt: new Date().toISOString()
  },
  // Additional question beyond the brief - highlights the multi-service model.
  {
    id: 'faq-6',
    question: 'Can I engage Miller Group for multiple services at once?',
    answer: 'Yes. That is our core advantage: "One Group. Many Solutions." Many property owners and businesses hire us to handle repairs, ongoing property management, IT infrastructure, and strategic consulting under one unified, accountable relationship.',
    category: 'General',
    displayOrder: 6,
    active: true,
    createdAt: new Date().toISOString()
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Miller Pro Contractor Toolset & Hardware Kit',
    slug: 'miller-pro-toolset',
    shortDescription: 'Industrial-grade maintenance toolset engineered for precision residential and facility repairs.',
    description: 'A curated professional-grade kit featuring durable vanadium steel wrenches, high-torque drivers, laser measuring unit, and commercial hardware organizers. Coming soon to the Miller Group store.',
    price: 189.99,
    salePrice: 159.99,
    sku: 'MIL-TL-001',
    images: ['https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop'],
    category: 'Tools & Equipment',
    inventory: 0,
    featured: true,
    active: true,
    comingSoon: true,
    seoTitle: 'Miller Pro Contractor Toolset | Coming Soon',
    seoDescription: 'High-durability contractor tools and equipment curated by Miller Group of Company LLC.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Small Business Growth & Financial Blueprint Kit',
    slug: 'business-financial-blueprint',
    shortDescription: 'Comprehensive digital templates, financial modeling spreadsheets, and operational SOPs for growing businesses.',
    description: 'Designed by our financial consultancy division, this digital toolkit equips entrepreneurs with ready-to-deploy cash flow forecasting sheets, budgeting models, and vendor contract templates.',
    price: 99.00,
    salePrice: 79.00,
    sku: 'MIL-DG-002',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'],
    category: 'Digital Services & Templates',
    inventory: 0,
    featured: true,
    active: true,
    comingSoon: true,
    seoTitle: 'Small Business Financial Blueprint Kit | Miller Group',
    seoDescription: 'Financial modeling spreadsheets and operational templates for small businesses.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Crucial Preventative Maintenance Steps Every Georgia Property Owner Should Take',
    slug: 'preventative-maintenance-steps-georgia-property-owners',
    excerpt: 'Avoid unexpected emergency repairs and protect your asset value with these proactive seasonal maintenance checklists.',
    content: `Owning residential or commercial real estate in Georgia means preparing your property for high summer humidity, severe weather, and seasonal shifts. 

### 1. Inspect Plumbing & Water Lines
Small pinhole leaks inside walls or beneath bathroom vanities often go unnoticed until mold or structural wood rot develops. Routine pressure inspections and fixture checks save thousands.

### 2. Gutter Clearing & Drainage Flow
Clogged gutters lead to water overflowing directly against foundations, leading to basement moisture and foundation cracking. Ensure downspouts direct rainwater at least 6 feet away from the structure.

### 3. Roof Flashing & Seal Integrity
Inspect chimney flashing, vent boots, and roof valleys after heavy windstorms. Replacing a worn flashing boot costs a fraction of a full ceiling drywall restoration.

### 4. Electrical Load & Breaker Safety
As modern homes and offices add high-draw electronic equipment, outdated panels and ungrounded circuits pose safety hazards. Annual panel inspections ensure safety compliance.

### 5. Partner with a Single Accountable Maintenance Provider
Rather than juggling five different emergency contractors, having one dependable partner like Miller Group of Company LLC ensures consistent quality, documented logs, and priority dispatch.`,
    coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
    author: 'Augustus Miller',
    category: 'Property Maintenance',
    tags: ['Property Care', 'Maintenance', 'Georgia Real Estate'],
    status: 'Published',
    publishedAt: '2026-03-01',
    readTime: '5 min read',
    seoTitle: 'Preventative Maintenance Guide for Georgia Properties | Miller Group',
    seoDescription: 'Actionable preventative maintenance tips for Georgia homeowners and commercial property managers.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'blog-2',
    title: 'How Strategic Financial Planning Propels Small Business Longevity',
    slug: 'strategic-financial-planning-small-business-growth',
    excerpt: 'Why cash flow visibility, disciplined budgeting, and objective advisory are essential for navigating volatile markets.',
    content: `Many thriving businesses struggle not from lack of sales, but from lack of structured cash flow management.

### The Power of Cash Flow Forecasting
Profit on an accrual income statement does not equal cash in the bank. Understanding your working capital cycle enables you to take on larger contracts without facing payroll crunches.

### Strategic Capital Allocation
When should you invest in new equipment versus leasing? How do you assess the ROI of adding staff? Miller Group’s consultancy division works alongside business owners to eliminate guesswork.

### Building Resilience
By establishing structured financial dashboards and milestone reviews, business leaders can steer their companies with confidence and sustainable peace of mind.`,
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    author: 'Augustus Miller',
    category: 'Business Strategy',
    tags: ['Business Growth', 'Financial Planning', 'Entrepreneurship'],
    status: 'Published',
    publishedAt: '2026-02-15',
    readTime: '4 min read',
    seoTitle: 'Strategic Financial Planning for Small Businesses | Miller Group',
    seoDescription: 'Learn how disciplined financial planning and cash flow management accelerate sustainable business growth.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const initialSiteSettings: SiteSettings = {
  businessName: 'MILLER GROUP OF COMPANY LLC',
  founderName: 'Augustus Miller',
  primaryPhone: '+1 (770) 572-2022',
  primaryEmail: 'sgustus76@gmail.com',
  primaryAddress: 'Metro Atlanta, GA, USA',
  serviceArea: 'Metro Atlanta, Surrounding Counties, and Statewide Georgia (Consulting Available Nationwide)',
  businessHours: 'Monday – Friday: 8:00 AM – 6:00 PM | Saturday: 9:00 AM – 4:00 PM | Sunday: Emergency On-Call',
  corporateMotto: 'One Group. Many Solutions. Endless Possibilities.',
  supportingTagline: 'Building Solutions. Delivering Value.',
  primaryCtaText: 'Request a Quote',
  secondaryCtaText: 'Book a Service',
  facebookUrl: '',
  linkedinUrl: 'https://linkedin.com',
  instagramUrl: '',
  mission: 'To deliver innovative, reliable, and high-quality professional services that create lasting value for our clients through integrity, excellence, customer-focused solutions, and continuous innovation while contributing positively to economic development and community growth.',
  vision: 'To become a leading diversified service company recognized nationally and internationally for excellence in business consultancy, construction, property management, information technology, transportation, and integrated business solutions.',
  footerText: '© 2026 Miller Group of Company LLC. All rights reserved. Professional diversified services across Georgia and beyond.',
  updatedAt: new Date().toISOString()
};
