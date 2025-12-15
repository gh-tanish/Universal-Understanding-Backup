document.addEventListener('DOMContentLoaded', function() {
  console.log('Script loaded');
  
  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  console.log('Theme toggle button:', themeToggle);
  const body = document.body;
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  console.log('Saved theme:', savedTheme);
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    if (themeToggle) themeToggle.textContent = 'Light';
  } else {
    body.classList.remove('light-mode');
    if (themeToggle) themeToggle.textContent = 'Dark';
  }
  
  // Theme toggle function
  function toggleTheme(e) {
    console.log('Toggle theme called');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isLightMode = body.classList.toggle('light-mode');
    console.log('Light mode:', isLightMode);
    if (themeToggle) themeToggle.textContent = isLightMode ? 'Light' : 'Dark';
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  }
  
  // Theme toggle button handlers - support both click and touch
  if (themeToggle) {
    console.log('Adding event listeners to theme toggle');
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('touchend', function(e) {
      e.preventDefault();
      toggleTheme(e);
    });
  } else {
    console.error('Theme toggle button not found!');
  }

  // Search functionality
  const searchBar = document.getElementById('siteSearch');
  const searchResults = document.getElementById('searchResults');
  
  // Define searchable topics with relative paths (no leading slash)
  const topics = [
    { title: 'Mathematical Foundations', path: 'Scientia/1-Mathematical-Foundations/index.html', section: 'Scientia', ref: 'SC1' },
    { title: 'Algebra & Functions', path: 'Scientia/1-Mathematical-Foundations/1-1-Algebra-and-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.1' },
    { title: 'Calculus', path: 'Scientia/1-Mathematical-Foundations/1-2-Calculus/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.2' },
    { title: 'Linear Algebra', path: 'Scientia/1-Mathematical-Foundations/1-3-Linear-Algebra/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.3' },
    { title: 'Differential Equations', path: 'Scientia/1-Mathematical-Foundations/1-4-Differential-Equations/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.4' },
    { title: 'Complex Numbers & Complex Analysis', path: 'Scientia/1-Mathematical-Foundations/1-5-Complex-Numbers/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.5' },
    { title: 'Vector & Tensor Calculus', path: 'Scientia/1-Mathematical-Foundations/1-6-Vector-and-Tensor-Calculus/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.6' },
    { title: 'Differential Geometry', path: 'Scientia/1-Mathematical-Foundations/1-7-Differential-Geometry/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.7' },
    { title: 'Probability & Statistics', path: 'Scientia/1-Mathematical-Foundations/1-8-Probability-and-Statistics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.8' },
    { title: 'Fourier & Transform Methods', path: 'Scientia/1-Mathematical-Foundations/1-9-Fourier-and-Transform-Methods/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.9' },
    { title: 'Group Theory Basics', path: 'Scientia/1-Mathematical-Foundations/1-10-Group-Theory-Basics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.10' },
    { title: 'Number Theory', path: 'Scientia/1-Mathematical-Foundations/1-11-Number-Theory/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.11' },
    { title: 'Topology Basics', path: 'Scientia/1-Mathematical-Foundations/1-12-Topology-Basics/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.12' },
    { title: 'Advanced Linear Algebra & Functional Analysis', path: 'Scientia/1-Mathematical-Foundations/1-13-Advanced-Linear-Algebra/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.13' },
    { title: 'Transcendental Functions', path: 'Scientia/1-Mathematical-Foundations/1-14-Transcendental-Functions/index.html', section: 'Scientia > Mathematical Foundations', ref: 'SC1.14' },
    { title: 'Physics Foundations', path: 'Scientia/2-Physics-Foundations/index.html', section: 'Scientia', ref: 'SC2' },
    { title: 'Quantum Mechanics', path: 'Scientia/3-Quantum-Mechanics/index.html', section: 'Scientia', ref: 'SC3' },
    { title: 'Relativity', path: 'Scientia/4-Relativity/index.html', section: 'Scientia', ref: 'SC4' },
    { title: 'Foundational Biomedical Sciences', path: 'Vitalis/1-Foundational-Biomedical-Sciences/index.html', section: 'Vitalis', ref: 'VI1' },
    { title: 'Cellular & Molecular Biology', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.1' },
    { title: 'Cell Structure & Organelles', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.1' },
    { title: 'Nucleus', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/1-1-1-1-Nucleus/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Structure & Organelles', ref: 'VI1.1.1.1' },
    { title: 'Endoplasmic Reticulum (ER)', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/1-1-1-2-Endoplasmic-Reticulum/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Structure & Organelles', ref: 'VI1.1.1.2' },
    { title: 'Golgi Apparatus', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/1-1-1-3-Golgi-Apparatus/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Structure & Organelles', ref: 'VI1.1.1.3' },
    { title: 'Lysosomes', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/1-1-1-4-Lysosomes/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Structure & Organelles', ref: 'VI1.1.1.4' },
    { title: 'Mitochondria', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/1-1-1-5-Mitochondria/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Structure & Organelles', ref: 'VI1.1.1.5' },
    { title: 'Cytoskeleton', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-1-Cell-Structure-and-Organelles/1-1-1-6-Cytoskeleton/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Structure & Organelles', ref: 'VI1.1.1.6' },
    { title: 'Membrane Composition & Transport', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-2-Membrane-Composition-and-Transport/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.2' },
    { title: 'Lipid Bilayer', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-2-Membrane-Composition-and-Transport/1-1-2-1-Lipid-Bilayer/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Membrane Composition & Transport', ref: 'VI1.1.2.1' },
    { title: 'Membrane Proteins', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-2-Membrane-Composition-and-Transport/1-1-2-2-Membrane-Proteins/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Membrane Composition & Transport', ref: 'VI1.1.2.2' },
    { title: 'Transport Mechanisms', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-2-Membrane-Composition-and-Transport/1-1-2-3-Transport-Mechanisms/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Membrane Composition & Transport', ref: 'VI1.1.2.3' },
    { title: 'Signal Transduction Pathways', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-3-Signal-Transduction-Pathways/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.3' },
    { title: 'GPCRs', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-3-Signal-Transduction-Pathways/1-1-3-1-GPCRs/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Signal Transduction Pathways', ref: 'VI1.1.3.1' },
    { title: 'Receptor Tyrosine Kinases (RTKs)', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-3-Signal-Transduction-Pathways/1-1-3-2-Receptor-Tyrosine-Kinases/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Signal Transduction Pathways', ref: 'VI1.1.3.2' },
    { title: 'cAMP-Mediated Signaling', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-3-Signal-Transduction-Pathways/1-1-3-3-cAMP-Mediated-Signaling/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Signal Transduction Pathways', ref: 'VI1.1.3.3' },
    { title: 'IP₃/DAG Pathway', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-3-Signal-Transduction-Pathways/1-1-3-4-IP3-DAG-Pathway/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Signal Transduction Pathways', ref: 'VI1.1.3.4' },
    { title: 'Calcium-Mediated Signals', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-3-Signal-Transduction-Pathways/1-1-3-5-Calcium-Mediated-Signals/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Signal Transduction Pathways', ref: 'VI1.1.3.5' },
    { title: 'Gene Expression & Regulation', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-4-Gene-Expression-and-Regulation/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.4' },
    { title: 'Transcription Factors', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-4-Gene-Expression-and-Regulation/1-1-4-1-Transcription-Factors/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Gene Expression & Regulation', ref: 'VI1.1.4.1' },
    { title: 'Enhancers/Silencers', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-4-Gene-Expression-and-Regulation/1-1-4-2-Enhancers-Silencers/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Gene Expression & Regulation', ref: 'VI1.1.4.2' },
    { title: 'Epigenetic Regulation', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-4-Gene-Expression-and-Regulation/1-1-4-3-Epigenetic-Regulation/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Gene Expression & Regulation', ref: 'VI1.1.4.3' },
    { title: 'Cell Cycle & Checkpoints', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-5-Cell-Cycle-and-Checkpoints/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.5' },
    { title: 'Phases', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-5-Cell-Cycle-and-Checkpoints/1-1-5-1-Phases/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Cycle & Checkpoints', ref: 'VI1.1.5.1' },
    { title: 'Checkpoints', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-5-Cell-Cycle-and-Checkpoints/1-1-5-2-Checkpoints/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Cycle & Checkpoints', ref: 'VI1.1.5.2' },
    { title: 'Regulatory Proteins', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-5-Cell-Cycle-and-Checkpoints/1-1-5-3-Regulatory-Proteins/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Cycle & Checkpoints', ref: 'VI1.1.5.3' },
    { title: 'Cell Death Mechanisms', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-6-Cell-Death-Mechanisms/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.6' },
    { title: 'Apoptosis', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-6-Cell-Death-Mechanisms/1-1-6-1-Apoptosis/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Death Mechanisms', ref: 'VI1.1.6.1' },
    { title: 'Necroptosis', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-6-Cell-Death-Mechanisms/1-1-6-2-Necroptosis/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Death Mechanisms', ref: 'VI1.1.6.2' },
    { title: 'Autophagy', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-6-Cell-Death-Mechanisms/1-1-6-3-Autophagy/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cell Death Mechanisms', ref: 'VI1.1.6.3' },
    { title: 'Cancer Biology Basics', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-7-Cancer-Biology-Basics/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology', ref: 'VI1.1.7' },
    { title: 'Oncogenes', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-7-Cancer-Biology-Basics/1-1-7-1-Oncogenes/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cancer Biology Basics', ref: 'VI1.1.7.1' },
    { title: 'Tumour Suppressors', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-7-Cancer-Biology-Basics/1-1-7-2-Tumour-Suppressors/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cancer Biology Basics', ref: 'VI1.1.7.2' },
    { title: 'DNA Repair Defects', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-1-Cellular-and-Molecular-Biology/1-1-7-Cancer-Biology-Basics/1-1-7-3-DNA-Repair-Defects/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Cellular & Molecular Biology > Cancer Biology Basics', ref: 'VI1.1.7.3' },
    { title: 'Biochemistry', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.2' },
    { title: 'Amino Acids & Protein Structure', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-1-Amino-Acids-and-Protein-Structure/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.1' },
    { title: 'Amino Acid Classification', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-1-Amino-Acids-and-Protein-Structure/1-2-1-1-Amino-Acid-Classification/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Amino Acids & Protein Structure', ref: 'VI1.2.1.1' },
    { title: 'Protein Hierarchy', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-1-Amino-Acids-and-Protein-Structure/1-2-1-2-Protein-Hierarchy/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Amino Acids & Protein Structure', ref: 'VI1.2.1.2' },
    { title: 'Structural Motifs', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-1-Amino-Acids-and-Protein-Structure/1-2-1-3-Structural-Motifs/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Amino Acids & Protein Structure', ref: 'VI1.2.1.3' },
    { title: 'Molecular Chaperones', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-1-Amino-Acids-and-Protein-Structure/1-2-1-4-Molecular-Chaperones/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Amino Acids & Protein Structure', ref: 'VI1.2.1.4' },
    { title: 'Enzyme Kinetics & Regulation', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-2-Enzyme-Kinetics-and-Regulation/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.2' },
    { title: 'Michaelis-Menten Kinetics', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-2-Enzyme-Kinetics-and-Regulation/1-2-2-1-Michaelis-Menten-Kinetics/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Enzyme Kinetics & Regulation', ref: 'VI1.2.2.1' },
    { title: 'Inhibition', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-2-Enzyme-Kinetics-and-Regulation/1-2-2-2-Inhibition/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Enzyme Kinetics & Regulation', ref: 'VI1.2.2.2' },
    { title: 'Allosteric Regulation', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-2-Enzyme-Kinetics-and-Regulation/1-2-2-3-Allosteric-Regulation/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Enzyme Kinetics & Regulation', ref: 'VI1.2.2.3' },
    { title: 'Carbohydrate Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-3-Carbohydrate-Metabolism/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.3' },
    { title: 'Glycolysis, Gluconeogenesis, TCA Cycle', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-3-Carbohydrate-Metabolism/1-2-3-1-Glycolysis-Gluconeogenesis-TCA/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Carbohydrate Metabolism', ref: 'VI1.2.3.1' },
    { title: 'Glycogen Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-3-Carbohydrate-Metabolism/1-2-3-2-Glycogen-Metabolism/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Carbohydrate Metabolism', ref: 'VI1.2.3.2' },
    { title: 'Regulation by Insulin, Glucagon, AMP', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-3-Carbohydrate-Metabolism/1-2-3-3-Hormonal-Regulation/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Carbohydrate Metabolism', ref: 'VI1.2.3.3' },
    { title: 'Lipid & Fatty Acid Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.4' },
    { title: 'β-Oxidation & Ketogenesis', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/1-2-4-1-Beta-Oxidation-and-Ketogenesis/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Lipid & Fatty Acid Metabolism', ref: 'VI1.2.4.1' },
    { title: 'Cholesterol Synthesis (HMG-CoA Reductase)', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/1-2-4-2-Cholesterol-Synthesis/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Lipid & Fatty Acid Metabolism', ref: 'VI1.2.4.2' },
    { title: 'Lipoprotein Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-4-Lipid-and-Fatty-Acid-Metabolism/1-2-4-3-Lipoprotein-Metabolism/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Lipid & Fatty Acid Metabolism', ref: 'VI1.2.4.3' },
    { title: 'Nucleotide & Nucleic Acid Metabolism', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-5-Nucleotide-and-Nucleic-Acid-Metabolism/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.5' },
    { title: 'Purine/Pyrimidine Synthesis & Salvage', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-5-Nucleotide-and-Nucleic-Acid-Metabolism/1-2-5-1-Purine-Pyrimidine-Synthesis/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Nucleotide & Nucleic Acid Metabolism', ref: 'VI1.2.5.1' },
    { title: 'DNA/RNA Precursors & Nucleoside Kinases', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-5-Nucleotide-and-Nucleic-Acid-Metabolism/1-2-5-2-DNA-RNA-Precursors/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Nucleotide & Nucleic Acid Metabolism', ref: 'VI1.2.5.2' },
    { title: 'Energy Metabolism & Bioenergetics', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-6-Energy-Metabolism-and-Bioenergetics/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.6' },
    { title: 'ATP Production, Oxidative Phosphorylation, ΔG', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-6-Energy-Metabolism-and-Bioenergetics/1-2-6-1-ATP-and-Oxidative-Phosphorylation/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Energy Metabolism & Bioenergetics', ref: 'VI1.2.6.1' },
    { title: 'Redox Reactions: NADH/NAD⁺, FADH₂', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-6-Energy-Metabolism-and-Bioenergetics/1-2-6-2-Redox-Reactions/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Energy Metabolism & Bioenergetics', ref: 'VI1.2.6.2' },
    { title: 'Clinical Metabolic Disorders', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-7-Clinical-Metabolic-Disorders/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry', ref: 'VI1.2.7' },
    { title: 'Phenylketonuria (PKU)', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-7-Clinical-Metabolic-Disorders/1-2-7-1-Phenylketonuria/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Clinical Metabolic Disorders', ref: 'VI1.2.7.1' },
    { title: 'Glycogen Storage Diseases (Type I-IX)', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-7-Clinical-Metabolic-Disorders/1-2-7-2-Glycogen-Storage-Diseases/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Clinical Metabolic Disorders', ref: 'VI1.2.7.2' },
    { title: 'Mitochondrial Disorders (Leigh, MELAS)', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-2-Biochemistry/1-2-7-Clinical-Metabolic-Disorders/1-2-7-3-Mitochondrial-Disorders/index.html', section: 'Vitalis > Foundational Biomedical Sciences > Biochemistry > Clinical Metabolic Disorders', ref: 'VI1.2.7.3' },
    { title: 'Molecular Genetics', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-3-Molecular-Genetics/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.3' },
    { title: 'Chemistry For Medicine', path: 'Vitalis/1-Foundational-Biomedical-Sciences/1-4-Chemistry-For-Medicine/index.html', section: 'Vitalis > Foundational Biomedical Sciences', ref: 'VI1.4' },
    { title: 'Anatomy & Human Structure', path: 'Vitalis/2-Anatomy-and-Human-Structure/index.html', section: 'Vitalis', ref: 'VI2' },
    { title: 'Physiology', path: 'Vitalis/3-Physiology/index.html', section: 'Vitalis', ref: 'VI3' },
    { title: 'Pathology', path: 'Vitalis/4-Pathology/index.html', section: 'Vitalis', ref: 'VI4' },
    { title: 'Pharmacology', path: 'Vitalis/5-Pharmacology/index.html', section: 'Vitalis', ref: 'VI5' },
    { title: 'Clinical Medicine', path: 'Vitalis/6-Clinical-Medicine/index.html', section: 'Vitalis', ref: 'VI6' },
    { title: 'Medical Specialties & Subspecialties', path: 'Vitalis/7-Medical-Specialties/index.html', section: 'Vitalis', ref: 'VI7' },
    { title: 'Advanced & Research Medicine', path: 'Vitalis/8-Advanced-Research-Medicine/index.html', section: 'Vitalis', ref: 'VI8' }
  ];

  if (searchBar && searchResults) {
    // Detect current page context
    const currentPath = window.location.pathname;
    let currentContext = 'all';
    
    if (currentPath.includes('Scientia') || currentPath.includes('scientia')) {
      currentContext = 'scientia';
      searchBar.placeholder = 'Search Scientia topics (SC)...';
    } else if (currentPath.includes('Vitalis') || currentPath.includes('vitalis')) {
      currentContext = 'vitalis';
      searchBar.placeholder = 'Search Vitalis topics (VI)...';
    } else if (currentPath.includes('Logos') || currentPath.includes('logos')) {
      currentContext = 'logos';
      searchBar.placeholder = 'Search Logos topics (LO)...';
    } else if (currentPath.includes('Sensus') || currentPath.includes('sensus')) {
      currentContext = 'sensus';
      searchBar.placeholder = 'Search Sensus topics (SE)...';
    }
    
    searchBar.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      if (query.length === 0) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        return;
      }

      // Filter topics based on context by ref code
      let contextTopics = topics;
      if (currentContext === 'scientia') {
        contextTopics = topics.filter(t => t.ref.startsWith('SC'));
      } else if (currentContext === 'vitalis') {
        contextTopics = topics.filter(t => t.ref.startsWith('VI'));
      } else if (currentContext === 'logos') {
        contextTopics = topics.filter(t => t.ref.startsWith('LO'));
      } else if (currentContext === 'sensus') {
        contextTopics = topics.filter(t => t.ref.startsWith('SE'));
      }

      const matches = contextTopics.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.section.toLowerCase().includes(query) ||
        topic.ref.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        searchResults.innerHTML = matches.map(match => {
          const dotCount = (match.ref.match(/\./g) || []).length;
          const depth = dotCount + 1;
          return `
          <div class="search-result-item" data-path="${match.path}">
            <div class="search-result-content">
              <div class="search-result-title">${match.title}</div>
              <div class="search-result-path">${match.section}</div>
            </div>
            <span class="search-ref" data-depth="${depth}">${match.ref}</span>
          </div>
        `}).join('');
        searchResults.classList.add('active');

        // Add click handlers to results
        document.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', function() {
            const targetPath = this.dataset.path;
            
            // Get current URL and normalize to forward slashes
            const currentUrl = window.location.href.replace(/\\/g, '/');
            
            // Find where "Website" folder is in the path (case-insensitive)
            const lowerUrl = currentUrl.toLowerCase();
            const websiteIdx = lowerUrl.lastIndexOf('/website/');
            
            if (websiteIdx === -1) {
              // Can't find Website folder, try direct navigation
              window.location.href = targetPath;
              return;
            }
            
            // Get the part after /website/ (this is our current location relative to Website root)
            const afterWebsite = currentUrl.substring(websiteIdx + 9); // 9 = length of '/website/'
            
            // Split by slashes and count directories (exclude the .html file and empty parts)
            const parts = afterWebsite.split('/').filter(part => {
              return part && part.trim() !== '' && !part.match(/\.html?$/i);
            });
            
            const depth = parts.length;
            
            console.log('Current URL:', currentUrl);
            console.log('After Website:', afterWebsite);
            console.log('Parts:', parts);
            console.log('Depth:', depth);
            console.log('Target:', targetPath);
            
            // Build relative path: go up 'depth' levels, then navigate to target
            let relativePath = '';
            for (let i = 0; i < depth; i++) {
              relativePath += '../';
            }
            relativePath += targetPath;
            
            console.log('Final relative path:', relativePath);
            
            window.location.href = relativePath;
          });
        });
      } else {
        searchResults.innerHTML = '<div class="search-result-item" style="cursor: default; pointer-events: none;">No results found</div>';
        searchResults.classList.add('active');
      }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
    
    // Keep search open when focusing on search bar
    searchBar.addEventListener('focus', function() {
      if (this.value.trim().length > 0) {
        searchResults.classList.add('active');
      }
    });
  }

  // Toggle function for expandable content
  var toggleButtons = document.querySelectorAll('.toggle-btn');
  
  toggleButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var nextDiv = this.nextElementSibling;
      while (nextDiv && !nextDiv.classList.contains('toggle-content')) {
        nextDiv = nextDiv.nextElementSibling;
      }
      
      if (nextDiv) {
        var isExpanded = nextDiv.classList.contains('expanded');
        if (isExpanded) {
          nextDiv.classList.remove('expanded');
          this.classList.remove('expanded');
        } else {
          nextDiv.classList.add('expanded');
          this.classList.add('expanded');
        }
      }
    });
  });

  const form = document.getElementById('contactForm');
  const result = document.getElementById('formResult');
  const submitBtn = form && form.querySelector('button[type="submit"]');

  form && form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    result.textContent = '';
    if (!submitBtn) return;
    submitBtn.disabled = true;

    const email = document.getElementById('email')?.value || '';
    const message = document.getElementById('message')?.value || '';

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message })
      });

      if (resp.ok) {
        result.textContent = 'Thanks — your message was received.';
        form.reset();
      } else {
        const text = await resp.text().catch(()=>resp.statusText||'Error');
        result.textContent = 'Submission failed: ' + text;
      }
    } catch (err) {
      result.textContent = 'Could not contact server — message not saved locally.';
      console.error(err);
    }

    submitBtn.disabled = false;
  });
});