<script setup lang="ts">
useSeoMeta({
  title: 'Share Your Tripport Story',
  description: 'Share your Tripport travel experience and help future travellers plan a more thoughtful Kerala journey.',
})
</script>

<template>
  <div class="share-story-page">
    <section class="share-story-hero">
      <div class="page-shell share-story-hero__content">
        <NuxtLink class="share-story-back" to="/"><MaterialIcon name="arrow_back" :size="17" /> Back to Tripport</NuxtLink>
        <span class="eyebrow">Traveller stories</span>
        <h1>Travelled with Tripport?<br><strong>Share your story.</strong></h1>
        <p>Your honest experience helps future travellers picture their own Kerala journey. Every story is reviewed by our team before it is published.</p>
      </div>
    </section>

    <section class="section page-shell share-story-layout">
      <aside class="share-story-aside">
        <span class="section-chip">A quick note</span>
        <h2>Your story, <br>handled with care.</h2>
        <p>It only takes a few minutes to leave a review. Your contact details and original files stay private unless a member of our team approves the story for the website.</p>
        <ol>
          <li><span>1</span><div><strong>Write your review</strong><p>Add a title, your experience and a star rating.</p></div></li>
          <li><span>2</span><div><strong>Add a favourite memory</strong><p>A photo or short video is optional, but always welcome.</p></div></li>
          <li><span>3</span><div><strong>We review it first</strong><p>Only approved stories are shared on Tripport.</p></div></li>
        </ol>
      </aside>
      <div class="share-story-form-wrap"><TestimonialSubmissionForm /></div>
    </section>
  </div>
</template>

<style scoped>
.share-story-page{background:linear-gradient(180deg,#f5f8f6 0,#fff 460px)}.share-story-hero{overflow:hidden;background:var(--forest);color:#fff}.share-story-hero__content{position:relative;padding-top:86px;padding-bottom:93px}.share-story-hero__content::after{position:absolute;right:-30px;bottom:-190px;width:520px;height:520px;border:1px solid rgb(255 255 255 / 16%);border-radius:50%;content:"";box-shadow:0 0 0 58px rgb(255 255 255 / 4%),0 0 0 117px rgb(255 255 255 / 3%)}.share-story-back{display:inline-flex;align-items:center;gap:6px;margin-bottom:52px;color:rgb(255 255 255 / 78%);font-size:13px;font-weight:800;transition:color .18s ease}.share-story-back:hover{color:#fff}.share-story-hero .eyebrow{position:relative;z-index:1;background:rgb(255 255 255 / 12%);color:#fff}.share-story-hero h1{position:relative;z-index:1;max-width:770px;margin:17px 0;color:#fff;font-size:clamp(46px,5.8vw,78px);font-weight:500;letter-spacing:-.075em;line-height:.96}.share-story-hero h1 strong{color:#bfe1ce;font-weight:650}.share-story-hero p{position:relative;z-index:1;max-width:585px;margin:0;color:rgb(255 255 255 / 76%);font-size:16px;line-height:1.65}.share-story-layout{display:grid;grid-template-columns:minmax(250px,.72fr) minmax(0,1.28fr);gap:clamp(42px,7vw,105px);align-items:start;padding-top:78px;padding-bottom:106px}.share-story-aside{position:sticky;top:112px}.share-story-aside h2{margin:18px 0 14px;color:#183d2f;font-size:clamp(34px,3.6vw,50px);letter-spacing:-.065em;line-height:.98}.share-story-aside>p{max-width:380px;margin:0;color:#67776f;font-size:14px;line-height:1.7}.share-story-aside ol{display:grid;gap:19px;padding:0;margin:35px 0 0;list-style:none}.share-story-aside li{display:grid;grid-template-columns:31px minmax(0,1fr);gap:11px}.share-story-aside li>span{display:grid;width:28px;height:28px;place-items:center;border-radius:50%;background:#e6f1e9;color:#1f6649;font-size:11px;font-weight:850}.share-story-aside li strong{display:block;color:#26483a;font-size:13px}.share-story-aside li p{margin:4px 0 0;color:#77847e;font-size:12px;line-height:1.5}.share-story-form-wrap{min-width:0}@media(max-width:850px){.share-story-layout{grid-template-columns:1fr;gap:40px;padding-top:58px}.share-story-aside{position:static}.share-story-aside>p{max-width:630px}.share-story-aside ol{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.share-story-aside li{grid-template-columns:1fr}.share-story-hero__content::after{right:-200px}}@media(max-width:620px){.share-story-hero__content{padding-top:51px;padding-bottom:67px}.share-story-back{margin-bottom:39px}.share-story-hero h1{font-size:46px}.share-story-hero p{font-size:14px}.share-story-layout{padding-top:43px;padding-bottom:70px}.share-story-aside ol{grid-template-columns:1fr;gap:14px}.share-story-aside li{grid-template-columns:31px minmax(0,1fr)}}
</style>
